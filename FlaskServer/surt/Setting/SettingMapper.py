from surt.Setting.detail.detail import Detail
from surt.Setting.notification.notification import Notifications
from surt.Setting.setup.Setup import Setup

class SettingMapper:

    def call(self, submodule, name):
        if (submodule == "detail"):
            if (name == "getDetail"):
                return Detail().getDetail()
            if (name == "setDetail"):
                return Detail().setDetail()
        if (submodule == "notification"):
            if (name == "getModule"):
                return Notifications().getModule()
            if (name == "getModuleTime"):
                return Notifications().getModuleTime()
            if (name == "getModuleDate"):
                return Notifications().getModuleDate()
            if (name == "getNotificationList"):
                return Notifications().getNotificationList()
            if (name == "setNotification"):
                return Notifications().setNotification()
        if (submodule == "setup"):
            if(name == "getSetupData"):
                return Setup().getSetups()
            if (name == "getModuleNotifications"):
                return Setup().getModuleNotifications()
            if(name == "setModuleCheckId"):
                return Setup().setModuleCheckId()
            if(name == "setallcheck"):
                return Setup().setallcheck()
