#!/usr/bin/env python

'''
Given a csv file of passenger stops, generate a json list of
(time, stopCode, passengerDelta) ordered by time.
Only items for which delta is non-zero are returned.
'''

import pandas as pd
import argparse
import sys
import json
from dateutil.parser import parse as isoparse
import logging


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('filename', metavar='DATA')
    parser.add_argument('-f', '--fromDate', dest='fromDate', type=isoparse)
    parser.add_argument('-t', '--toDate', dest='toDate', type=isoparse)

    args = parser.parse_args(sys.argv[1:])

    logging.basicConfig(level=logging.INFO, format='%(message)s')

    logging.info('Reading %s' % args.filename)
    df = pd.read_csv(args.filename, parse_dates=['stopTimeReal'])
    logging.info('... got %d rows' % len(df))

    # Remove uninteresting columns
    df = df[['stopTimeReal', 'stopCode',
             'passengerCountStopUp', 'passengerCountStopDown']]

    # Filter by time range
    if args.fromDate:
        df = df[df['stopTimeReal'] >= args.fromDate]
        logging.info('Keeping from %s. %d left' % (args.fromDate, len(df)))
    if args.toDate:
        df = df[df['stopTimeReal'] <= args.toDate]
        logging.info('Keeping to %s. %d left' % (args.toDate, len(df)))

    df['delta'] = df.passengerCountStopUp - df.passengerCountStopDown
    df = df[df['delta'] != 0]
    logging.info('Only keeping eventful stops. %d left' % len(df))

    logging.info('Stats about deltas:\n%s' % df['delta'].describe())

    df = df.sort('stopTimeReal')

    def row_to_item(r):
        return dict(t=str(r['stopTimeReal']), s=r['stopCode'], d=r['delta'])

    objectList = [row_to_item(series) for _index, series in df.iterrows()]
    print json.dumps(objectList, indent=4)
