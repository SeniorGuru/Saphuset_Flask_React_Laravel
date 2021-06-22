import base64
import time
import datetime
from flask import request
from sqlalchemy.sql import func
from surt.Utils.logger import Logger
from surt.Models.users import Users
from surt.Utils.response import Response
from surt.Models.m_module_manager import mModuleManager
from surt.Models.m_groups import mGroups
from surt.Models.m_instance import mInstance
from surt.Models.m_module_notification_config import mModuleNotificationConfig
from surt.Models.m_instance_grouper import mInstanceGrouper

# Dreamcat
from datetime import datetime


class Setup:

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

    def getSetups(self):

        try:
            response = {"module_list": [], "group_list": [], "instance_list": []}
            # Sample to access Databse table
            modules = self.connection.query(mModuleManager).filter().all()
            for module in modules:
                module_list = {}
                module_list['module_id'] = module.module_id
                module_list['module_name'] = module.module_name
                module_list['module_description'] = module.module_description
                response["module_list"].append(module_list)

            groups = self.connection.query(mGroups).filter().all()
            for group in groups:
                module_list = {}
                module_list['group_id'] = group.group_id
                module_list['group_name'] = group.group_name
                module_list['group_description'] = group.group_description
                response["group_list"].append(module_list)
            instances = self.connection.query(mInstance).filter().all()
            for instance in instances:
                module_list = {}
                module_list['mssysname'] = instance.mssysname
                response["instance_list"].append(module_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getModuleNotifications(self):

        try:
            response = {"module_noti_list": []}
            instances = self.connection.query(mInstance).all()
            count = 0
            for instance in instances:
                module_managers = self.connection.query(mModuleManager).all()
                for module_manager in module_managers:
                    count += 1
                    module = self.connection.query(mModuleNotificationConfig).filter(
                        mModuleNotificationConfig.user_id == self.user.get("id"),
                        mModuleNotificationConfig.mssysname == instance.mssysname,
                        mModuleNotificationConfig.module == module_manager.module_id
                    ).first()
                    if module is None:
                        module = mModuleNotificationConfig(user_id=self.user.get("id"),
                                                           user_email=self.user.get("email"),
                                                           mssysname=instance.mssysname,
                                                           module=module_manager.module_id,
                                                           sms=1,
                                                           email=1,
                                                           pdf_report=1)
                        self.connection.add(module)
                        self.connection.commit()
                    groups = self.connection.query(mInstanceGrouper).filter(
                        mInstanceGrouper.mssysname == instance.mssysname).all()
                    group_id = ''
                    for group in groups:
                        group_id += str(group.group_id) + ","
                    module_list = {'id': count, 'module': module.module, 'mssysname': module.mssysname,
                                   'group_id': group_id,
                                   'sms': module.sms, 'email': module.email, 'pdf_report': module.pdf_report}
                    response["module_noti_list"].append(module_list)
            # Sample to access Databse table
            # groupers = self.connection.query(mInstanceGrouper).all()
            # for grouper in groupers:
            #     module_list['group_id'] = grouper.group_id
            #     modules = self.connection.query(mModuleNotificationConfig).filter(
            #         mModuleNotificationConfig.user_id == self.user.get("id")).all()
            #     for count, module in enumerate(modules):
            #         module_list = {}
            #         module_list['id'] = count
            #         module_list['module'] = module.module
            #         module_list['mssysname'] = module.mssysname
            #
            #
            #         module_list['sms'] = module.sms
            #         module_list['email'] = module.email
            #         module_list['pdf_report'] = module.pdf_report
            #         response["module_noti_list"].append(module_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def setModuleCheckId(self):
        try:
            # Sample to access Databse table
            print(self.oData["type"])
            print(self.oData["module"])
            print(self.oData["mssysname"])
            type = self.oData["type"]
            moduleconfig = self.connection.query(mModuleNotificationConfig).filter(
                mModuleNotificationConfig.module == self.oData["module"],
                mModuleNotificationConfig.mssysname == self.oData["mssysname"],
                mModuleNotificationConfig.user_id == self.user.get("id")).first()
            if type == 0:
                moduleconfig.sms = self.oData["value"]
            elif type == 1:
                moduleconfig.email = self.oData["value"]
            else:
                moduleconfig.pdf_report = self.oData["value"]
            self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def setallcheck(self):

        try:
            # Sample to access Databse table
            print(self.oData["type"])
            filterDatas = self.oData["filterData"]
            type = self.oData["type"]
            for filterData in filterDatas:
                moduleconfig = self.connection.query(mModuleNotificationConfig).filter(
                    mModuleNotificationConfig.user_id == self.user.get("id"),
                    mModuleNotificationConfig.module == filterData["module"],
                    mModuleNotificationConfig.mssysname == filterData["mssysname"], ).first()
                if type == 0:
                    moduleconfig.sms = 0
                    moduleconfig.email = 0
                    moduleconfig.pdf_report = 0
                else:
                    moduleconfig.sms = 1
                    moduleconfig.email = 1
                    moduleconfig.pdf_report = 1
                self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()
