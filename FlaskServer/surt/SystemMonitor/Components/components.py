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
from surt.Models.fm_th_saprel4 import fmThSaprel4
from surt.Models.cvers import CVERS
import re


class Components:

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

    def getComponents(self):

        try:
            response = {"group_list": [], "conf_list": [], "sys_list": [], "table_list": [], "kerns_list": []}
            # Sample to access Databse table
            components = self.connection.query(CVERS).group_by(CVERS.COMPONENT).all()

            groups = self.connection.query(mGroups).all()
            for group in groups:
                group_list = {}
                group_list['group_name'] = group.group_name
                group_list['group_id'] = group.group_id
                response["group_list"].append(group_list)
                table_list = {}
                table_list['id'] = group.group_id
                table_list['group_name'] = group.group_name
                sysnames = self.connection.query(mInstanceGrouper).filter(mInstanceGrouper.group_id == group.group_id).all()
                sysnamelist = ''
                sysList = []
                if len(sysnames) != 0:
                    for sysname in sysnames:
                        sysnamelist += sysname.mssysname + " "
                        sysList.append(sysname.mssysname)
                table_list['sysnamelist'] = sysnamelist
                table_list['sysList'] = sysList
                component_list = []
                for idx, component in enumerate(components):
                    component_data = {}
                    component_data["id"] = idx
                    component_data["component"] = component.COMPONENT
                    component_data["release"] = component.RELEASE
                    component_data["new_release"] = component.NEWEXTRELEASE
                    for sysname in sysnames:
                        val = self.connection.query(CVERS).filter(CVERS.COMPONENT == component.COMPONENT, CVERS.MSSYSNAME == sysname.mssysname).order_by(desc(CVERS.created_at)).first()
                        if val is not None:
                            component_data[sysname.mssysname] = val.EXTRELEASE
                        else :
                            component_data[sysname.mssysname] = ''
                    component_list.append(component_data)
                table_list['s_detail'] = component_list
                response["table_list"].append(table_list)

            confs = self.connection.query(mUserSystemMonitorStatusConf).filter(
                mUserSystemMonitorStatusConf.user_id == self.user.get("id")).all()
            for conf in confs:
                conf_list = {}
                conf_list['status_type'] = conf.status_type
                conf_list['count'] = conf.count
                response["conf_list"].append(conf_list)

            systems = self.connection.query(mInstance).all()
            for system in systems:
                syslist = {}
                syslist["mssysname"] = system.mssysname
                syslist["description"] = system.description
                response["sys_list"].append(syslist)

            saprels = self.connection.query(fmThSaprel4).all()
            for idx, saprel in enumerate(saprels):
                kern_list = {}
                kern_list["id"] = idx
                kern_list["KERN_REL"] = saprel.KERN_REL
                kern_list["KERN_MAKE_VARIANT"] = saprel.KERN_MAKE_VARIANT
                kern_list["KERN_DBLIB"] = saprel.KERN_DBLIB
                kern_list["KERN_COMP_ON"] = saprel.KERN_COMP_ON
                kern_list["KERN_COMP_TIME"] = saprel.KERN_COMP_TIME
                kern_list["KERN_PATCHLEVEL"] = saprel.KERN_PATCHLEVEL
                kern_list["KERN_SUPPORTLEVEL"] = saprel.KERN_SUPPORTLEVEL
                kern_list["KERN_PATCHNUMBER"] = saprel.KERN_PATCHNUMBER
                kern_list["KERN_SOURCEID"] = saprel.KERN_SOURCEID
                kern_list["KERN_COMP_LEVEL"] = saprel.KERN_COMP_LEVEL
                kern_list["MSSYSNAME"] = saprel.MSSYSNAME
                response["kerns_list"].append(kern_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()
