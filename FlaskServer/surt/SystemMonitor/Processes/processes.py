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
from surt.Models.fm_process_states import fmProcessStates
from surt.Models.m_hosts import mHosts
from surt.Models.m_user_system_mointor_status_conf import mUserSystemMonitorStatusConf
from surt.Models.fm_process import fmProcess
import re


class Processes:

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

    def getProcesses(self):

        try:
            response = {"group_list": [], "today_number": 0, "sys_list": [], "conf_list": [], "state_list": [],
                        "mindate": '', "maxdate": ''}
            # Sample to access Databse table

            mindate = self.connection.query(func.min(fmProcess.created_at)).scalar()
            maxdate = self.connection.query(func.max(fmProcess.created_at)).scalar()
            response["mindate"] = str(mindate)
            response["maxdate"] = str(maxdate)
            groups = self.connection.query(mGroups).all()
            for group in groups:
                group_list = {}
                group_list['group_name'] = group.group_name
                group_list['group_id'] = group.group_id
                response["group_list"].append(group_list)

            confs = self.connection.query(mUserSystemMonitorStatusConf).filter(
                mUserSystemMonitorStatusConf.user_id == self.user.get("id")).all()
            for conf in confs:
                conf_list = {}
                conf_list['status_type'] = conf.status_type
                conf_list['count'] = conf.count
                response["conf_list"].append(conf_list)

            states = self.connection.query(fmProcessStates).all()
            for state in states:
                state_list = {}
                state_list["STATE"] = state.STATE
                state_list["TITLE"] = state.TITLE
                response["state_list"].append(state_list)
            datenows = datetime.datetime.now()
            datenow = datenows.replace(hour=0, minute=0, second=0, microsecond=0)
            print('datenow', datenow)
            instances = self.connection.query(mInstance).all()
            sys_list = {}
            sys_list["msserver"] = []
            for instance in instances:
                groups = self.connection.query(mInstanceGrouper).filter(
                    mInstanceGrouper.mssysname == instance.mssysname).all()
                group_id = ''
                for group in groups:
                    group_id += str(group.group_id) + ","
                servernames = self.connection.query(mHosts).filter(mHosts.mssysname == instance.mssysname).all()
                if len(servernames) == 0:
                    continue
                print('servernames', datenow)
                for servername in servernames:
                    server = {}
                    processes = self.connection.query(fmProcess).filter(fmProcess.MSSYSNAME == instance.mssysname,
                                                                        fmProcess.SERVER_NAME == servername.mssrvname,
                                                                        fmProcess.created_at >= datenow).order_by(
                        desc(fmProcess.created_at)).group_by(fmProcess.PROCESS_ID).all()
                    if len(processes) == 0:
                        continue
                    server["group_id"] = group_id
                    server["mssysname"] = instance.mssysname
                    server["msservernames"] = servername.mssrvname
                    server["status"] = self.connection.query(fmProcess).filter(
                        fmProcess.MSSYSNAME == instance.mssysname,
                        fmProcess.SERVER_NAME == servername.mssrvname).group_by(fmProcess.PROCESS_ID).count()
                    server["id"] = ''
                    server["MSSYSNAME"] = ''
                    server["SERVER_NAME"] = ''
                    server["NUMBER"] = ''
                    server["TYPE"] = ''
                    server["PROCESS_ID"] = ''
                    server["PROCESS_STATE"] = ''
                    server["ON_HOLD_INFO"] = ''
                    server["WP_FAILUERS"] = ''
                    server["CPU_TIME"] = ''
                    server["TIME"] = ''
                    server["WAIT_PRIORITY"] = ''
                    server["PROGRAM_NAME"] = ''
                    server["CLIENT"] = ''
                    server["USER"] = ''
                    server["PRIORITY"] = ''
                    for process in processes:
                        server["id"] += str(process.id) + '\n'
                        server["MSSYSNAME"] += str(process.MSSYSNAME) + '\n'
                        server["SERVER_NAME"] += str(process.SERVER_NAME) + '\n'
                        server["NUMBER"] += str(process.NUMBER) + '\n'
                        server["TYPE"] += str(process.TYPE) + '\n'
                        server["PROCESS_ID"] += str(process.PROCESS_ID) + '\n'
                        server["PROCESS_STATE"] += str(process.PROCESS_STATE) + '\n'
                        server["ON_HOLD_INFO"] += str(process.ON_HOLD_INFO) + '\n'
                        server["WP_FAILUERS"] += str(process.WP_FAILUERS) + '\n'
                        server["CPU_TIME"] += str(process.CPU_TIME) + '\n'
                        server["TIME"] += str(process.TIME) + '\n'
                        server["WAIT_PRIORITY"] += str(process.WAIT_PRIORITY) + '\n'
                        server["PROGRAM_NAME"] += str(process.PROGRAM_NAME) + '\n'
                        server["CLIENT"] += str(process.CLIENT) + '\n'
                        server["USER"] += str(process.USER) + '\n'
                        server["PRIORITY"] += str(process.PRIORITY) + '\n'
                    sys_list["msserver"].append(server)
            response["sys_list"] = sys_list["msserver"]
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getCharts(self):

        try:
            response = {"chart_list": {}}

            sysname = self.oData["sysname"]
            servername = self.oData["servername"]
            periodId = self.oData["periodId"]
            startDate = self.oData["startDate"]
            toDate = self.oData["toDate"]

            datenows = datetime.datetime.now()
            datenow = datenows.replace(hour=0, minute=0, second=0, microsecond=0)

            if toDate is not None:
                datenow = datetime.datetime.strptime(toDate, "%Y-%m-%d")
            ch_list = {}
            ch_list["DIA"] = []
            ch_list["BGD"] = []
            ch_list["SPO"] = []
            ch_list["UPD"] = []
            ch_list["UP2"] = []

            types = ['DIA', 'BGD', 'SPO', 'UPD', 'UP2']
            typeavg = ['DIAAvg', 'BGDAvg', 'SPOAvg', 'UPDAvg', 'UP2Avg']
            for idx, te in enumerate(types):
                for x in range(24):
                    fromTime = datenow + timedelta(hours=x)
                    toTime = datenow + timedelta(hours=(x + 1))
                    cValues = self.connection.query(fmProcess).filter(fmProcess.MSSYSNAME == sysname,
                                                                      fmProcess.SERVER_NAME == servername,
                                                                      fmProcess.created_at >= fromTime,
                                                                      fmProcess.created_at < toTime,
                                                                      fmProcess.TYPE == te
                                                                      ).count()
                    ch_list[te].append(cValues)
                total = 0
                for x in range(4):
                    fromTime = datenow - timedelta(days=(x * 7))
                    toTime = fromTime + timedelta(days=1)
                    cValues = self.connection.query(fmProcess).filter(fmProcess.MSSYSNAME == sysname,
                                                                      fmProcess.SERVER_NAME == servername,
                                                                      fmProcess.created_at >= fromTime,
                                                                      fmProcess.created_at < toTime,
                                                                      fmProcess.TYPE == te
                                                                      ).count()
                    total += cValues
                ch_list[typeavg[idx]] = total / 4
            response["chart_list"] = ch_list
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getProcessesPeriod(self):

        try:
            response = {"sys_list": []}
            # Sample to access Databse table

            ids = request.args.get('id').replace('?', '')
            print('ids', ids)
            datenows = datetime.datetime.now()
            datenow = datenows.replace(hour=0, minute=0, second=0, microsecond=0)
            datefrom = datenow - timedelta(days=int(ids))
            dateto = datenow + timedelta(days=1)
            instances = self.connection.query(mInstance).all()
            sys_list = {}
            sys_list["msserver"] = []
            for instance in instances:

                groups = self.connection.query(mInstanceGrouper).filter(
                    mInstanceGrouper.mssysname == instance.mssysname).all()
                group_id = ''
                for group in groups:
                    group_id += str(group.group_id) + ","
                servernames = self.connection.query(mHosts).filter(mHosts.mssysname == instance.mssysname).all()
                if len(servernames) == 0:
                    continue
                print('servernames', len(servernames))
                for servername in servernames:
                    server = {}
                    processes = self.connection.query(fmProcess).filter(fmProcess.MSSYSNAME == instance.mssysname,
                                                                        fmProcess.SERVER_NAME == servername.mssrvname,
                                                                        fmProcess.created_at >= datefrom,
                                                                        fmProcess.created_at < dateto).order_by(
                        desc(fmProcess.created_at)).group_by(fmProcess.PROCESS_ID).all()
                    if len(processes) == 0:
                        continue
                    server["group_id"] = group_id
                    server["mssysname"] = instance.mssysname
                    server["msservernames"] = servername.mssrvname
                    server["status"] = self.connection.query(fmProcess).filter(
                        fmProcess.MSSYSNAME == instance.mssysname,
                        fmProcess.SERVER_NAME == servername.mssrvname).group_by(fmProcess.PROCESS_ID).count()
                    server["id"] = ''
                    server["MSSYSNAME"] = ''
                    server["SERVER_NAME"] = ''
                    server["NUMBER"] = ''
                    server["TYPE"] = ''
                    server["PROCESS_ID"] = ''
                    server["PROCESS_STATE"] = ''
                    server["ON_HOLD_INFO"] = ''
                    server["WP_FAILUERS"] = ''
                    server["CPU_TIME"] = ''
                    server["TIME"] = ''
                    server["WAIT_PRIORITY"] = ''
                    server["PROGRAM_NAME"] = ''
                    server["CLIENT"] = ''
                    server["USER"] = ''
                    server["PRIORITY"] = ''
                    for process in processes:
                        server["id"] += str(process.id) + '\n'
                        server["MSSYSNAME"] += str(process.MSSYSNAME) + '\n'
                        server["SERVER_NAME"] += str(process.SERVER_NAME) + '\n'
                        server["NUMBER"] += str(process.NUMBER) + '\n'
                        server["TYPE"] += str(process.TYPE) + '\n'
                        server["PROCESS_ID"] += str(process.PROCESS_ID) + '\n'
                        server["PROCESS_STATE"] += str(process.PROCESS_STATE) + '\n'
                        server["ON_HOLD_INFO"] += str(process.ON_HOLD_INFO) + '\n'
                        server["WP_FAILUERS"] += str(process.WP_FAILUERS) + '\n'
                        server["CPU_TIME"] += str(process.CPU_TIME) + '\n'
                        server["TIME"] += str(process.TIME) + '\n'
                        server["WAIT_PRIORITY"] += str(process.WAIT_PRIORITY) + '\n'
                        server["PROGRAM_NAME"] += str(process.PROGRAM_NAME) + '\n'
                        server["CLIENT"] += str(process.CLIENT) + '\n'
                        server["USER"] += str(process.USER) + '\n'
                        server["PRIORITY"] += str(process.PRIORITY) + '\n'
                    sys_list["msserver"].append(server)
            response["sys_list"] = sys_list["msserver"]
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getRange(self):

        try:
            response = {"sys_list": []}
            # Sample to access Databse table
            starttime = self.oData["startDate"]
            totime = self.oData["toDate"]
            print('starttime', starttime)
            print('totime', totime)
            datefrom = datetime.datetime.strptime(starttime, "%Y-%m-%d")
            dateto = datetime.datetime.strptime(totime, "%Y-%m-%d")
            instances = self.connection.query(mInstance).all()
            sys_list = {}
            sys_list["msserver"] = []
            for instance in instances:
                groups = self.connection.query(mInstanceGrouper).filter(
                    mInstanceGrouper.mssysname == instance.mssysname).all()
                group_id = ''
                for group in groups:
                    group_id += str(group.group_id) + ","
                servernames = self.connection.query(mHosts).filter(mHosts.mssysname == instance.mssysname).all()
                if len(servernames) == 0:
                    continue
                print('servernames', len(servernames))
                for servername in servernames:
                    server = {}
                    processes = self.connection.query(fmProcess).filter(fmProcess.MSSYSNAME == instance.mssysname,
                                                                        fmProcess.SERVER_NAME == servername.mssrvname,
                                                                        fmProcess.created_at >= datefrom,
                                                                        fmProcess.created_at < dateto).order_by(
                        desc(fmProcess.created_at)).group_by(fmProcess.PROCESS_ID).all()
                    if len(processes) == 0:
                        continue
                    server["group_id"] = group_id
                    server["mssysname"] = instance.mssysname
                    server["msservernames"] = servername.mssrvname
                    server["status"] = self.connection.query(fmProcess).filter(
                        fmProcess.MSSYSNAME == instance.mssysname,
                        fmProcess.SERVER_NAME == servername.mssrvname).group_by(fmProcess.PROCESS_ID).count()
                    server["id"] = ''
                    server["MSSYSNAME"] = ''
                    server["SERVER_NAME"] = ''
                    server["NUMBER"] = ''
                    server["TYPE"] = ''
                    server["PROCESS_ID"] = ''
                    server["PROCESS_STATE"] = ''
                    server["ON_HOLD_INFO"] = ''
                    server["WP_FAILUERS"] = ''
                    server["CPU_TIME"] = ''
                    server["TIME"] = ''
                    server["WAIT_PRIORITY"] = ''
                    server["PROGRAM_NAME"] = ''
                    server["CLIENT"] = ''
                    server["USER"] = ''
                    server["PRIORITY"] = ''
                    for process in processes:
                        server["id"] += process.id + '\n'
                        server["MSSYSNAME"] += process.MSSYSNAME + '\n'
                        server["SERVER_NAME"] += process.SERVER_NAME + '\n'
                        server["NUMBER"] += process.NUMBER + '\n'
                        server["TYPE"] += process.TYPE + '\n'
                        server["PROCESS_ID"] += process.PROCESS_ID + '\n'
                        server["PROCESS_STATE"] += process.PROCESS_STATE + '\n'
                        server["ON_HOLD_INFO"] += process.ON_HOLD_INFO + '\n'
                        server["WP_FAILUERS"] += process.WP_FAILUERS + '\n'
                        server["CPU_TIME"] += process.CPU_TIME + '\n'
                        server["TIME"] += process.TIME + '\n'
                        server["WAIT_PRIORITY"] += process.WAIT_PRIORITY + '\n'
                        server["PROGRAM_NAME"] += process.PROGRAM_NAME + '\n'
                        server["CLIENT"] += process.CLIENT + '\n'
                        server["USER"] += process.USER + '\n'
                        server["PRIORITY"] += process.PRIORITY + '\n'
                    sys_list["msserver"].append(server)
            response["sys_list"] = sys_list["msserver"]
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()
