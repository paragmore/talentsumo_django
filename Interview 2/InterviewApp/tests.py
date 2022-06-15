
import pandas as pd

# Create your tests here.

li = ['Your_name', 'Email_Address', 'Interview_Link', 'Interview_Link_1', 'Interview_Link_2', 'Reviewer_Email', 'Nominee_Email', 'review_Interview_Link', 'review_Interview_Link_1', 'review_Interview_Link_2', 'SubDate', 'ipAddress', 'commReview', 'reviewStatus', 'overGrade', 'sent', 'sentDate']
li1=[{'cName': 'Your_name', 'avalue': 'fgfg'}, {'cName': 'Email_Address', 'avalue': 'dfgfd@fsdd.fhjf'}, {'cName': 'Interview_Link', 'avalue': 'fgfdgdf'}, {'cName': 'Interview_Link_1', 'avalue': 'fgdf'}, {'cName': 'Interview_Link_2', 'avalue': 'fgdfg'}, {'cName': 'Reviewer_Email', 'avalue': 'fgfd@hfghhjh.ghjg'}, {'cName': 'Nominee_Email', 'avalue': 'dfd@gfg.ghjgh'}, {'cName': 'review_Interview_Link', 'avalue': 'null'}, {'cName': 'review_Interview_Link_1', 'avalue': 'null'}, {'cName': 'review_Interview_Link_2', 'avalue': 'null'}, {'cName': 'SubDate', 'avalue': '2022-01-03T08:38:50.656Z'}, {'cName': 'ipAddress', 'avalue': '157.47.101.175'}, {'cName': 'commReview', 'avalue': 'null'}, {'cName': 'reviewStatus', 'avalue': 'No'}, {'cName': 'overGrade', 'avalue': 'null'}, {'cName': 'sent', 'avalue': 'No'}, {'cName': 'sentDate', 'avalue': 'null'}]
li2= [{'cName': 'Your_name', 'qvalue': 'Your name'}, {'cName': 'Email_Address', 'qvalue': 'Email Address'}, {'cName': 'Interview_Link', 'qvalue': 'Interview Link'}, {'cName': 'Interview_Link_1', 'qvalue': 'Interview Link 1'}, {'cName': 'Interview_Link_2', 'qvalue': 'Interview Link 2'}, {'cName': 'Reviewer_Email', 'qvalue': 'Reviewer Email'}, {'cName': 'Nominee_Email', 'qvalue': 'Nominee Email'}, {'cName': 'review_Interview_Link', 'qvalue': 'null'}, {'cName': 'review_Interview_Link_1', 'qvalue': 'null'}, {'cName': 'review_Interview_Link_2', 'qvalue': 'null'}, {'cName': 'SubDate', 'qvalue': 'SubDate'}, {'cName': 'ipAddress', 'qvalue': 'ipAddress'}, {'cName': 'commReview', 'qvalue': 'commReview'}, {'cName': 'reviewStatus', 'qvalue': 'reviewStatus'}, {'cName': 'overGrade', 'qvalue': 'overGrade'}, {'cName': 'sent', 'qvalue': 'sent'}, {'cName': 'sentDate', 'qvalue': 'sentDate'}]


adf = pd.DataFrame(li1)
qdf = pd.DataFrame(li2)
for colist in li:
    print(adf.loc[adf['cName'] == str(colist), 'avalue'].iloc[0])
    print(qdf.loc[qdf['cName'] == str(colist), 'qvalue'].iloc[0])
