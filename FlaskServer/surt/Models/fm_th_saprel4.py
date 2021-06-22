from sqlalchemy import create_engine, MetaData, Table, Column, String, INT, SMALLINT, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class fmThSaprel4(Base):
    __tablename__ = 'fm_th_saprel4'
    KERN_REL = Column(String, primary_key=True)
    KERN_MAKE_VARIANT = Column(String)
    KERN_COMP_LEVEL = Column(String)
    KERN_COMP_ON = Column(String)
    KERN_COMP_TIME = Column(String)
    KERN_DBLIB = Column(String)
    KERN_PATCHLEVEL = Column(String)
    KERN_PATCHNUMBER = Column(String)
    KERN_SOURCEID = Column(String)
    KERN_SUPPORTLEVEL = Column(String)
    MSSYSNAME = Column(String, primary_key=True)
    NEWKERN_REL = Column(String)
    created_at = Column(DateTime)
    created_by = Column(String)
    updated_at = Column(DateTime)
    updated_by = Column(String)

# ALTER TABLE `22`.m_instance ADD created_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD created_by varchar(100) NULL;
# ALTER TABLE `22`.m_instance ADD updated_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD updated_by varchar(100) NULL;