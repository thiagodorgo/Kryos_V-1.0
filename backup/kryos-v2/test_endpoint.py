#!/usr/bin/env python3
import sys
import os
sys.path.append('backend')

try:
    from app.main import app
    from fastapi.testclient import TestClient
    
    client = TestClient(app)
    
    # Test the new endpoint with a simple XML file
    xml_content = '''<?xml version="1.0" encoding="UTF-8"?>
<mbs_configuration>
  <device addr="1" name="Test Device" code="test">
    <reg addr="0" code="temp" />
    <reg addr="1" code="hum" />
  </device>
</mbs_configuration>'''
    
    files = {'xml_file': ('test.xml', xml_content, 'application/xml')}
    data = {
        'host': 'localhost',
        'port': '502',
        'plant_name': 'Test Plant'
    }
    
    print("Testing /api/scans/server-import-upload endpoint...")
    response = client.post('/api/scans/server-import-upload', files=files, data=data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code != 200:
        print("ERROR: Endpoint failed!")
    else:
        print("SUCCESS: Endpoint working!")
        
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()