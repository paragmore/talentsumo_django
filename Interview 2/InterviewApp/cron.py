
import logging
# Get an instance of a logger
logger = logging.getLogger(__name__)
import mysql.connector
from datetime import date
from mysql.connector import Error
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def my_scheduled_job():
    logger.warning("Cron job Called")
    connection = mysql.connector.connect(host='',database='techtvxs_interview',user='techtvxs_phpinterview',password='(%G3CBBg}pBg')
    cursor = connection.cursor()
    cursor.execute("SELECT tbl_Name,formName FROM `tbl_mapping` where status=True")
    rowforms = cursor.fetchall()
    cursor.close()
    connection = mysql.connector.connect(host='',database='techtvxs_interview',user='techtvxs_phpinterview',password='(%G3CBBg}pBg')
    cursor = connection.cursor()
    today = date.today()
    cursor.execute("SELECT * from `tbl_campaign_details` WHERE  `campaign_Date`= '"+today.strftime("%Y/%m/%d")+"' and campaign_Status='Active';")
    rowcount = cursor.fetchall()
    if rowcount != None:
        for rows in rowcount:
            campdetails = list(rows)
            cursor.execute("SELECT `form_ID` from `forms_templates` WHERE  `id`= '"+str(campdetails[6])+"';")
            intervlink = 'https://spellcheck.techdivaa.com/'+cursor.fetchone()[0]
            user_id = str(campdetails[3])
            result = sendEmailCampaign(user_id,str(campdetails[2]),intervlink,'campMessage')
            if(result == 'sent'):
                stmt1 = "UPDATE `tbl_campaign_details` SET `campaign_Status`='Completed' WHERE id='"+str(campdetails[0])+"'"
                cursor.execute(stmt1)
                connection.commit()
    cursor.close()
    logger.warning("executed")

def sendEmailCampaign(userid,camp_list,intervlink,type):
    connection = mysql.connector.connect(host='',database='techtvxs_interview',user='techtvxs_phpinterview',password='(%G3CBBg}pBg')
    cursor = connection.cursor()
    getsettings= "SELECT `settings_Field`, `settings_Value` FROM settings_tbl WHERE userid = '"+str(userid)+"';"
    cursor.execute(getsettings)
    results = cursor.fetchall()
    if(cursor.rowcount == 0):
        getsettings= "SELECT `settings_Field`, `settings_Value` FROM settings_tbl WHERE userid  = 51;"
        cursor.execute(getsettings)
        results = cursor.fetchall()
    host = ''
    port = ''
    login = ''  
    password = ''
    fromaddr = '' 
    message = ''
    if(len(results) != 0):
        host = results[0][1]
        port = results[1][1]
        login = results[2][1]
        password = results[3][1]
        fromaddr =  results[4][1]
        if(type=="campMessage"):
            campMessgtatus = results[13][1]
            if(campMessgtatus == 'true'):
                cursor.execute("SELECT * from `tbl_students_details` WHERE  `student_list_id`= '"+str(camp_list)+"';")
                stu_details = cursor.fetchall()
                for student in stu_details:
                    list_studetails = list(student)
                    stud_name = list_studetails[1]
                    stud_email = list_studetails[2]
                    stud_collage = list_studetails[3]
                    stud_spec = list_studetails[4]
                    stud_course = list_studetails[5]
                    stud_year = list_studetails[6]
                    cMessgtext = results[14][1]
                    cMessgtext = str(cMessgtext)
                    cMessgtext = cMessgtext.replace('@Name', stud_name)
                    cMessgtext = cMessgtext.replace('@Email', stud_email)
                    cMessgtext = cMessgtext.replace('@Collage', stud_collage)
                    cMessgtext = cMessgtext.replace('@Specialization', stud_spec)
                    cMessgtext = cMessgtext.replace('@Course', stud_course)
                    cMessgtext = cMessgtext.replace('@Year', stud_year)
                    cMessgtext = cMessgtext.replace("@InterviewLink", intervlink)
                    mailstatus = SendEmailAct(fromaddr,stud_email,login,password,host,port,cMessgtext,'Career Interview Link')
                    logger.warning(mailstatus)
                cursor.close()
                return "sent"
                
def SendEmailAct(fromaddr,sendto,login,password,host, port,message,subject):
    acport = ''
    if(int(port) == 25):
        acport = int(587)
    else:
       acport = int(port)
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = fromaddr
    msg['To'] = sendto
    part2 = MIMEText(message, 'html')
    msg.attach(part2)
    s = smtplib.SMTP(host,int(acport))
    s.login(login, password)
    s.sendmail(fromaddr, sendto, msg.as_string())
    s.quit()
    logger.warning("mail Sent" )
    return "mail Sent" 
    
    
def mytest():
    logger.warning("Cron job Called")
