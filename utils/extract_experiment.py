# db connection
from pymongo import MongoClient
import json, os

connection = MongoClient()

db = connection['sin3d']
data_collection = db['datas']

output_results_folder = 'results'
experiments_identifier = ['sin3d-PrISE-3D']

experiment_results = data_collection.find({
    'data.msg.experimentName': 'MatchExtractsWithReference', 
    'data.msgId': 'EXPERIMENT_VALIDATED',
    'data.experimentId':{
        '$in': experiments_identifier
    }
    # '$not': { '$gt': 1.99 }
})

if not os.path.exists(output_results_folder):
    os.makedirs(output_results_folder)

results_filename = 'experiments_results.json'
results_filepath = os.path.join(output_results_folder, results_filename)

export_data = []

for result in experiment_results:
    export_data.append(result['data'])

print('Save results into', results_filepath)
with open(results_filepath, 'w') as f:
    f.write(json.dumps(export_data, indent=4))