from surt.SystemMonitor.Dumps.dumps import Dumps
from surt.SystemMonitor.Processes.processes import Processes
from surt.SystemMonitor.Components.components import Components

class Mapper:

    def call(self, submodule, name):
        if (submodule == "dumps"):
            if (name == "getTabs"):
                return Dumps().getTabs()
            if (name == "setTabs"):
                return Dumps().setTabs()
            if (name == "getDumps"):
                return Dumps().getDumps()
            if (name == "getCharts"):
                return Dumps().getCharts()
            if (name == "setConfiguration"):
                return Dumps().setConfiguration()
            if (name == "setApproved"):
                return Dumps().setApproved()
        if (submodule == "process"):
            if (name == "getProcesses"):
                return Processes().getProcesses()
            if (name == "getCharts"):
                return Processes().getCharts()
            if (name == "getProcessesPeriod"):
                return Processes().getProcessesPeriod()
            if (name == "getRange"):
                return Processes().getRange()
        if (submodule == "component"):
            if (name == "getComponents"):
                return Components().getComponents()