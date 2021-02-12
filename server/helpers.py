import time
from datetime import datetime

def get_id():
    return str(time.time_ns())[-16:]

def get_timestamp():
    ms = str(time.time()).split(".")[1][:6]
    ms += (6 - len(ms)) * "0"
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S") +"."+ ms

def strify(ret, types=(datetime, )):
    # Helper function to stringify datetime so json.dumps works
    l = []
    for val in ret:
        if isinstance(val, tuple):
            val = strify(val)
        if isinstance(val, types):
            val = str(val)
        l.append(val)
    return tuple(l) 

def parse_report(report):
    success, report = report
    if success:
        d = {}
        for *_, loc, _ in report:
            d[loc] = []
        
        for _, item, _, loc, qty in report:
            d[loc].append((item, qty))
        report = d
    return success, report 

# Helper one liners
join_vals = lambda vals:','.join(list(map(lambda x: f'"{x}"' if isinstance(x,str) else str(x), vals)))
insert_sql = lambda t, cols, vals : f"""insert into {t} ({','.join(cols)}) values ({join_vals(vals)});"""
