import base64
import time
import datetime
from flask import request
from sqlalchemy.sql import func
from surt.Utils.logger import Logger
from surt.Models.users import Users
from surt.Utils.response import Response
from surt.Models.m_module_manager import mModuleManager
from surt.Models.m_user_module_time_config import mUserModuleTimeConfig
from surt.Models.m_user_notification_config import mUserNotificationConfig
from surt.Models.m_user_days_config import mUserDaysConfig

# Dreamcat
from datetime import datetime

class Notifications:

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

    def getModule(self):
        try:
            response = {"module_list": []}
            # Sample to access Databse table
            modules = self.connection.query(mModuleManager).filter().all()
            for module in modules:
                module_list = {}
                module_list['module_id'] = module.module_id
                module_list['module_name'] = module.module_name
                module_list['module_description'] = module.module_description
                response["module_list"].append(module_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getModuleTime(self):
        try:
            response = {"moduleTime_list": []}
            # Sample to access Databse table
            print('hello')
            print(self.user.get("id"))
            moduletimes = self.connection.query(mUserModuleTimeConfig.module.distinct().label("module"), "from_time", "to_time").filter(mUserModuleTimeConfig.user_id == self.user.get("id")).all()
            print(len(moduletimes))
            for moduletime in moduletimes:
                module_list = {}
                module_list['module'] = moduletime.module
                module_list['from_time'] = moduletime.from_time.__str__()
                module_list['to_time'] = moduletime.to_time.__str__()
                response["moduleTime_list"].append(module_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getModuleDate(self):
        try:
            response = {"moduleDate_list": []}
            # Sample to access Databse table
            moduletdates = self.connection.query(mUserDaysConfig.module.distinct().label("module"), "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday").filter(mUserDaysConfig.user_id == self.user.get("id")).all()
            for moduledate in moduletdates:
                module_list = {}
                module_list['module'] = moduledate.module
                module_list['days'] = [moduledate.sunday, moduledate.monday, moduledate.tuesday, moduledate.wednesday, moduledate.thursday, moduledate.friday, moduledate.saturday]
                response["moduleDate_list"].append(module_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()


    def getNotificationList(self):
        try:
            response = {"notification_list": []}
            # Sample to access Databse table
            notifications = self.connection.query(mUserNotificationConfig.module.distinct().label("module"), "notif_type", "description", "allowed").filter(mUserNotificationConfig.user_id == self.user.get("id")).all()
            for notification in notifications:
                module_list = {}
                module_list['module'] = notification.module
                module_list['notif_type'] = notification.notif_type
                module_list['allowed'] = notification.allowed
                module_list['description'] = notification.description
                response["notification_list"].append(module_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def setNotification(self):
        try:

            # Sample to access Databse table
            print(self.oData["id"])
            print(self.oData["from_time"])
            print(self.oData["to_time"])
            print(self.oData["days"])
            print(self.oData["notifies"])
            timeconfig = self.connection.query(mUserModuleTimeConfig).filter(mUserModuleTimeConfig.module == self.oData["id"], mUserModuleTimeConfig.user_id == self.user.get("id")).first()
            timeconfig.from_time = self.oData['from_time']
            timeconfig.to_time = self.oData['to_time']
            self.connection.commit()
            userdays = self.connection.query(mUserDaysConfig).filter(mUserDaysConfig.module == self.oData["id"], mUserDaysConfig.user_id == self.user.get("id")).first()
            days = self.oData["days"]
            userdays.sunday = days[0]["value"]
            userdays.monday = days[1]["value"]
            userdays.tuesday = days[2]["value"]
            userdays.wednesday = days[3]["value"]
            userdays.thursday = days[4]["value"]
            userdays.friday = days[5]["value"]
            userdays.saturday = days[6]["value"]
            self.connection.commit()
            notifies = self.oData["notifies"]
            for notify in notifies:
                noticonfig = self.connection.query(mUserNotificationConfig).filter(
                    mUserNotificationConfig.module == self.oData["id"],
                    mUserNotificationConfig.user_id == self.user.get("id"), mUserNotificationConfig.notif_type == notify["key"]).first()
                noticonfig.description = notify["description"]
                noticonfig.allowed = notify["allowed"]
                self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()