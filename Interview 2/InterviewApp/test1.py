from collections import Counter

sample=['name', 'emailaddress', 'multiplechoice', 'link', 'nomineeemail', 'revieweremail', 'longanswerexample', 'phonenumberexample', 'datetimeexample', 'numberexample', 'singlechoiceexample', 'imagechoiceexample', 'dropdownexample', 'scaleexample', 'matrixexample', 'fileuploadexample', 'signatureexample', 'titleexample', 'descriptionexample', 'singlechoice', 'dropdown', 'longanswer', 'datetime', 'dropdown', 'SubDate', 'ipAddress', 'commReview', 'reviewStatus', 'overGrade', 'sent', 'sentDate']

numbers = { 
    word: iter([""] if count == 1 else range(1, count + 1)) 
    for word, count in Counter(sample).items()
}

result = [
    word + str(next(numbers[word])) 
    for word in sample
]

print(result)