#!/usr/bin/env python

'''
Reads a geojson file and generates a json object in which the keys are
stop codes and the values are (x, y) coordinates.
'''

import pandas as pd
import argparse
import sys
import logging
import json


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('filename', metavar='DATA')
    args = parser.parse_args(sys.argv[1:])

    logging.basicConfig(level=logging.INFO, format='%(message)s')

    logging.info('Reading %s' % args.filename)
    with open(args.filename) as f:
        j = json.load(f)

    d = []
    for feat in j['features']:
        x, y, _z = feat['geometry']['coordinates']
        d.append((feat['properties']['stopCode'], x, y))

    df = pd.DataFrame(d, columns=['stop', 'x', 'y'])
    df.drop_duplicates(cols='stop', take_last=True, inplace=True)

    logging.info('Stats about stop coordinates\n%s',
                 df.describe())

    bounds = dict(minx=df['x'].min(), maxx=df['x'].max(),
                  miny=df['y'].min(), maxy=df['y'].max())

    stops = dict((s['stop'], (s['x'], s['y'])) for _index, s in df.iterrows())

    o = dict(bounds=bounds, stops=stops)
    print json.dumps(o, indent=4)
