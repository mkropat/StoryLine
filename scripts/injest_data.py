import copy, json
from openpyxl import load_workbook
from selenium import webdriver

driver = webdriver.Chrome()
driver.set_window_size(560, 150)

wb = load_workbook('NewsStories.xlsx')

names = ['Ebola','iPhone6']
raw = {}
stories = []
event_count = 0

for name in names:
    events_by_date = {}
    
    sheet = wb.get_sheet_by_name(name)
    hdr = sheet.rows[0]
    
    fields = [cell.value for cell in hdr]
    
    raw[name] = []
    for row in sheet.rows[1:]:
        raw_row = {}
        for key, cell in zip(fields, row):
            if key:
                raw_row[key]=cell.value
    
        raw[name].append(raw_row)
        
    for row in raw[name]:
        if not row['eventDate']:
            row['eventDate'] = row['articleDate']
        
        event_datetime = row['eventDate'] or row['articleDate']
        
        if event_datetime:
            event_date = event_datetime.strftime('%Y-%m-%d')
            if not event_date in events_by_date:
                event_count += 1
                events_by_date[event_date] = {
                    'eventId':copy.copy(event_count),
                    'title':'',
                    'date':event_date,
                    'urls':[],
                    'tags':set()
                }
            
            event = events_by_date[event_date]
            if row['title']:
                event['title'] = row['title']
            
            try:
                driver.get(row['url'])
                driver.save_screenshot('./FlaskApp/static/images/event%s.png' % event['eventId'])
                img_url = 'http://www.storylinenews.co/static/images/event%s.png' % event['eventId']
            except:
                print "Couldn't load img for %s" % row['url']
            
            event['urls'].append({
                'url': row['url'],
                'img': img_url
            })
        
            if row['tags']:
                for tag in row['tags'].split(','):
                    event['tags'].add(tag.lower())
        
    events = events_by_date.values()
    events.sort(key=lambda x: x['date'])
    
    for event in events:
        event['tags']=list(event['tags'])
        
    data = {
        'stories':{
            'title':name
        },
        'events': events
    }
    
    with open('./FlaskApp/static/data/%s.json'%name, 'w') as fp:
        json.dump(data,fp)
            
        
        