import base64
import time
import datetime

from datetime import timedelta
from flask import request
from sqlalchemy.sql import func
from sqlalchemy import desc
from sqlalchemy import asc
from surt.Utils.logger import Logger
from surt.Models.users import Users
from surt.Utils.response import Response
from surt.Models.m_user_system_mointor_settings import mUserSystemMonitorSettings
from surt.Models.m_module_manager import mModuleManager
from surt.Models.m_groups import mGroups
from surt.Models.m_instance import mInstance
from surt.Models.m_instance_grouper import mInstanceGrouper
from surt.Models.m_clients import mClients
from surt.Models.snap import SNAP
from surt.Models.m_user_system_mointor_status_conf import mUserSystemMonitorStatusConf


class Dumps:

    def __init__(self):
        # Tenant Database connection instance
        self.connection = request.environ['connection']
        # Tenancy Database connection instance
        self.tenancyConnection = request.environ['tenancyConnection']
        # Post Data
        self.oData = request.get_json().get("data")
        # Logged in User Data
        self.user = request.get_json()['user']
        # Logger Instance
        self.logger = Logger()

    def getTabs(self):

        tabs = ['CPU', 'Memory', 'Dumps', 'Idoc', 'Avability', 'System Log', 'Components', 'Batch Jobs', 'Parameters',
                'Backup', 'Dialog Processes', 'RFC', 'STMS', 'ST06', 'Tune Summery(ST02)', 'Security Notes']
        try:
            response = {"tabs_list": []}
            for tab in tabs:
                module = self.connection.query(mUserSystemMonitorSettings).filter(
                    mUserSystemMonitorSettings.user_id == self.user.get("id"),
                    mUserSystemMonitorSettings.tab == tab,
                ).first()
                if module is None:
                    module = mUserSystemMonitorSettings(user_id=self.user.get("id"),
                                                        user_email=self.user.get("email"),
                                                        tab=tab,
                                                        visible=1)
                    self.connection.add(module)
                    self.connection.commit()
                module_list = {}
                module_list['key'] = tab
                module_list['value'] = module.visible
                module_list['number'] = 0
                response["tabs_list"].append(module_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getDumps(self):

        try:
            response = {"group_list": [], "today_number": 0, "snap_list": [], "conf_list": []}
            # Sample to access Databse table
            print('hello')
            groups = self.connection.query(mGroups).all()
            for group in groups:
                group_list = {}
                group_list['group_name'] = group.group_name
                group_list['group_id'] = group.group_id
                response["group_list"].append(group_list)

            confs = self.connection.query(mUserSystemMonitorStatusConf).filter(mUserSystemMonitorStatusConf.user_id == self.user.get("id")).all()
            for conf in confs:
                conf_list = {}
                conf_list['status_type'] = conf.status_type
                conf_list['count'] = conf.count
                response["conf_list"].append(conf_list)

            datenow = datetime.datetime.now()
            datestr = (str(datenow.day) if datenow.day > 9 else '0' + str(datenow.day)) + '.' + (
                str(datenow.month) if datenow.month > 9 else '0' + str(datenow.month)) + '.' + str(datenow.year)
            snaps = self.connection.query(SNAP).filter(SNAP.DATUM == datestr).all()
            response["today_number"] = len(snaps)

            snaps = self.connection.query(SNAP).filter(SNAP.APPROVED == 0).group_by(SNAP.MSSYSNAME, SNAP.RUNTIME_ERROR, SNAP.DATUM, SNAP.TERMINATED_PROGRAM, SNAP.UNAME).order_by(desc(SNAP.DATUM)).all()
            for snap in snaps:
                today_total = self.connection.query(SNAP.DATUM).filter(SNAP.DATUM == snap.DATUM,
                                                                       SNAP.EXCEPTION == snap.EXCEPTION,
                                                                       SNAP.RUNTIME_ERROR == snap.RUNTIME_ERROR,
                                                                       SNAP.TERMINATED_PROGRAM == snap.TERMINATED_PROGRAM,
                                                                       SNAP.AHOST == snap.AHOST).all()
                total = self.connection.query(SNAP.DATUM).filter(SNAP.DATUM).filter(SNAP.DATUM == snap.DATUM,
                                                                                    SNAP.EXCEPTION == snap.EXCEPTION,
                                                                                    SNAP.RUNTIME_ERROR == snap.RUNTIME_ERROR,
                                                                                    SNAP.TERMINATED_PROGRAM == snap.TERMINATED_PROGRAM,
                                                                                    SNAP.AHOST == snap.AHOST).all()

                snap_list = {}
                snap_list["id"] = snap.id
                snap_list["status"] = 0
                snap_list["DATUM"] = snap.DATUM
                datecurrent = datetime.datetime.strptime(snap.DATUM, '%d.%m.%Y')
                delta = datenow - datecurrent
                snap_list["period"] = delta.days
                snap_list["UZEIT"] = snap.UZEIT
                snap_list["UNAME"] = snap.UNAME
                snap_list["MANDT"] = snap.MANDT
                groups = self.connection.query(mInstanceGrouper).filter(
                    mInstanceGrouper.mssysname == snap.MSSYSNAME).all()
                group_id = ''
                for group in groups:
                    group_id += str(group.group_id) + ","
                snap_list["group_id"] = group_id
                snap_list["sid"] = snap.MSSYSNAME
                snap_list["AHOST"] = snap.AHOST
                snap_list["SEQNO"] = snap.SEQNO
                snap_list["RUNTIME_ERROR"] = snap.RUNTIME_ERROR
                snap_list["EXCEPTION"] = snap.EXCEPTION
                snap_list["TERMINATED_PROGRAM"] = snap.TERMINATED_PROGRAM
                snap_list["TRANSACTION_ID"] = snap.TRANSACTION_ID
                snap_list["currentToday"] = len(today_total)
                snap_list["totalDays"] = len(total)
                snap_list["details"] = '0'
                snap_list["approved"] = snap.APPROVED
                snap_list["short_text"] = snap.SHORT_TEXT
                snap_list["what_happened"] = snap.WHAT_HAPPEND
                response["snap_list"].append(snap_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getCharts(self):

        try:
            response = {"chart_list": {}}
            # Sample to access Databse table
            print('hello')

            ids = request.args.get('id').replace('?', '')
            print(ids)
            snap = self.connection.query(SNAP).filter(SNAP.id == ids).first()
            ch_list = {}
            ch_list["id"] = snap.id
            ch_list["now"] = []
            ch_list["before"] = []
            datecurrent = datetime.datetime.strptime(snap.DATUM, '%d.%m.%Y')
            for x in range(24):
                start_time = str(x) if x > 9 else '0' + str(x)
                to_time = str(x + 1) if (x + 1) > 9 else '0' + str(x + 1)
                to_list = self.connection.query(SNAP).filter(SNAP.DATUM == snap.DATUM, SNAP.UZEIT >= start_time,
                                                             SNAP.UZEIT < to_time,
                                                             SNAP.EXCEPTION == snap.EXCEPTION,
                                                             SNAP.RUNTIME_ERROR == snap.RUNTIME_ERROR,
                                                             SNAP.TERMINATED_PROGRAM == snap.TERMINATED_PROGRAM,
                                                             SNAP.AHOST == snap.AHOST).all()
                ch_list["now"].append(len(to_list))
                ch_total = 0
                for y in range(4):
                    calc_date = datecurrent - timedelta(days=7 * y)
                    calc_datestr = (str(calc_date.day) if calc_date.day > 9 else '0' + str(calc_date.day)) + '.' + (
                        str(calc_date.month) if calc_date.month > 9 else '0' + str(calc_date.month)) + '.' + str(calc_date.year)
                    to_list = self.connection.query(SNAP).filter(SNAP.DATUM == calc_datestr,
                                                                 SNAP.UZEIT >= start_time,
                                                                 SNAP.UZEIT < to_time,
                                                                 SNAP.EXCEPTION == snap.EXCEPTION,
                                                                 SNAP.RUNTIME_ERROR == snap.RUNTIME_ERROR,
                                                                 SNAP.TERMINATED_PROGRAM == snap.TERMINATED_PROGRAM,
                                                                 SNAP.AHOST == snap.AHOST).all()
                    ch_total = ch_total + len(to_list)
                ch_list["before"].append(int(ch_total / 4 + 0.5))
                ch_list["weekNow"] = []
                ch_list["weekbefore"] = []
                ch_list["weekdays"] = []
            for x in range(7):
                cu_date = datecurrent - timedelta(days=(6-x))
                cu_date_str = (str(cu_date.day) if cu_date.day > 9 else '0' + str(cu_date.day)) + '.' + (
                    str(cu_date.month) if cu_date.month > 9 else '0' + str(cu_date.month)) + '.' + str(cu_date.year)
                weekday = (
                              str(cu_date.month) if cu_date.month > 9 else '0' + str(cu_date.month)) + '.' + (
                              str(cu_date.day) if cu_date.day > 9 else '0' + str(cu_date.day))
                to_list = self.connection.query(SNAP).filter(SNAP.DATUM == cu_date_str,
                                                             SNAP.EXCEPTION == snap.EXCEPTION,
                                                             SNAP.RUNTIME_ERROR == snap.RUNTIME_ERROR,
                                                             SNAP.TERMINATED_PROGRAM == snap.TERMINATED_PROGRAM,
                                                             SNAP.AHOST == snap.AHOST).all()
                ch_list["weekNow"].append(len(to_list))
                ch_list["weekdays"].append( (str(cu_date.day) if cu_date.day > 9 else '0' + str(cu_date.day)) + '.' + (
                    str(cu_date.month) if cu_date.month > 9 else '0' + str(cu_date.month)))
                ch_total = 0
                for y in range(4):
                    calc_date = cu_date - timedelta(days=7 * y)
                    calc_datestr = (str(calc_date.day) if calc_date.day > 9 else '0' + str(calc_date.day)) + '.' + (
                        str(calc_date.month) if calc_date.month > 9 else '0' + str(calc_date.month)) + '.' + str(calc_date.year)
                    to_list = self.connection.query(SNAP).filter(SNAP.DATUM == calc_datestr,
                                                                 SNAP.EXCEPTION == snap.EXCEPTION,
                                                                 SNAP.RUNTIME_ERROR == snap.RUNTIME_ERROR,
                                                                 SNAP.TERMINATED_PROGRAM == snap.TERMINATED_PROGRAM,
                                                                 SNAP.AHOST == snap.AHOST).all()
                    ch_total = ch_total + len(to_list)
                ch_list["weekbefore"].append(int(ch_total / 4 + 0.5))
            response["chart_list"] = ch_list
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def setTabs(self):
        try:
            # Sample to access Databse table
            print(self.oData["tab"])
            module = self.connection.query(mUserSystemMonitorSettings).filter(
                mUserSystemMonitorSettings.user_id == self.user.get("id"),
                mUserSystemMonitorSettings.tab == self.oData["tab"]).first()
            if module.visible == 1:
                module.visible = 0
            else:
                module.visible = 1
            self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def setConfiguration(self):
        try:
            # Sample to access Databse table

            module = self.connection.query(mUserSystemMonitorStatusConf).filter(
                mUserSystemMonitorStatusConf.user_id == self.user.get("id"),
                mUserSystemMonitorStatusConf.status_type == "SUCCESS").first()
            module.count = self.oData["greenVal"]
            self.connection.commit()
            module = self.connection.query(mUserSystemMonitorStatusConf).filter(
                mUserSystemMonitorStatusConf.user_id == self.user.get("id"),
                mUserSystemMonitorStatusConf.status_type == "WARNING").first()
            module.count = self.oData["yellowVal"]
            self.connection.commit()
            module = self.connection.query(mUserSystemMonitorStatusConf).filter(
                mUserSystemMonitorStatusConf.user_id == self.user.get("id"),
                mUserSystemMonitorStatusConf.status_type == "ERROR").first()
            module.count = self.oData["redVal"]
            self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def setApproved(self):
        try:
            # Sample to access Databse table
            datas = self.oData["approves"]

            for data in datas:
                module = self.connection.query(SNAP).filter(
                    SNAP.id == data).first()
                module.APPROVED = 1
                self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()