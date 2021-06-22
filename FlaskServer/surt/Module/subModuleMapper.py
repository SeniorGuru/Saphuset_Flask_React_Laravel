from .subModule.group import Group
from .subModule.team import Team



class Mapper:

    def call(self, submodule, name):
        if (submodule == "group"):
            if (name == "hello"):
                return Group().hello()
            if (name == "addGroup"):
                return Group().addGroup()
            if (name == "getAllGroup"):
                return Group().getAllGroup()
            if (name == "deleteGroup"):
                return Group().deleteGroup()
            if (name == "getSelectedGroup"):
                return Group().getSelectedGroup()
            if (name == "getGroupedSystem"):
                return Group().getGroupedSystem()
            if (name == "getAllGrouper"):
                return Group().getAllGrouper()
            if (name == "addGrouper"):
                return Group().addGrouper()
            if (name == "editGroup"):
                return Group().editGroup()
        if (submodule == "team"):
            if (name == "getAllTeam"):
                return Team().getAllTeam()
            if (name == "getAllFunction"):
                return Team().getAllFunction()
            if (name == "getLeadUsers"):
                return Team().getLeadUsers()
            if (name == "addTeam"):
                return Team().addTeam()
            if (name == "editTeam"):
                return Team().editTeam()
            if (name == "deleteTeam"):
                return Team().deleteTeam()
