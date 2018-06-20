def load_data(item_handle):
    import os, json
    from collections import OrderedDict

    path_corpus = '/data_corpus/clickbait17-validation-170630'
    path_file_instances = os.path.join(path_corpus, 'instances.jsonl')
    path_file_truth = os.path.join(path_corpus, 'truth.jsonl')

    path_static_files = '/var/www/python/corpus-viewer/viewer-framework/static/clickbait'
    os.makedirs(path_static_files+'/media')

    def load_truth(path_file_truth):
        dictionary_truth = {}
        with open(path_file_truth, 'r') as f:
            for line in f:
                obj_truth = json.loads(line)

                dictionary_truth[obj_truth['id']] = obj_truth
                
        return dictionary_truth
        

    dictionary_truth = load_truth(path_file_truth)
    counter = 0
    with open(path_file_instances, 'r') as f:
        for index, line in enumerate(f):
            obj_tweet = json.loads(line)

            obj_truth = dictionary_truth[obj_tweet['id']]

            dictionary_instance = {
                'id': obj_tweet['id'],
                'postTimestamp': obj_tweet['postTimestamp'],
                'targetDescription': obj_tweet['targetDescription'],
                'targetKeywords': obj_tweet['targetKeywords'],
                'targetTitle': obj_tweet['targetTitle'],
                'postText': obj_tweet['postText'],
                'targetCaptions': obj_tweet['targetCaptions'],
                'targetParagraphs': obj_tweet['targetParagraphs'],
                'postMedia': obj_tweet['postMedia'],
                'truthJudgments': obj_truth['truthJudgments'],
                'truthMean': obj_truth['truthMean'],
                'truthMedian': obj_truth['truthMedian'],
                'truthMode': obj_truth['truthMode'],
                'truthClass': obj_truth['truthClass'],
                'isClickbait': True if obj_truth['truthClass'] == 'clickbait' else False,
            }
            item_handle.add(dictionary_instance)

            for name_image in obj_tweet['postMedia']:
                path_image = os.path.join(path_corpus, name_image)
                os.symlink(path_image, os.path.join(path_static_files, name_image))

            
    print('errors: {}'.format(counter))
# this is the main dictionary containing the necessary information to load and display your corpus
DICT_SETTINGS_VIEWER = {
    'id_corpus': 'clickbait',
    'name': 'Clickbait',
    'description': '',
    'data_type': 'custom',
    'load_data_function': load_data,
    'data_fields': {
        'id': {
            'type': 'string',
            'display_name': 'ID'
        },
        'postTimestamp': {
            'type': 'string',
            'display_name': 'Timestamp'
        },
        'isClickbait': {
            'type': 'boolean',
            'display_name': 'Is Clickbait'
        },
        # 'targetDescription': {
        #     'type': 'text',
        #     'display_name': 'Target Description'
        # },
        # 'targetKeywords': {
        #     'type': 'text',
        #     'display_name': 'Target Keywords'
        # },
        # 'targetTitle': {
        #     'type': 'text',
        #     'display_name': 'Target Title'
        # },
        'postText': {
            'type': 'text',
            'display_name': 'Post Text'
        },
        # 'targetCaptions': {
        #     'type': 'text',
        #     'display_name': 'Target Captions'
        # },
        # 'targetParagraphs': {
        #     'type': 'text',
        #     'display_name': 'Target Paragraphs'
        # },
        # 'postMedia': {
        #     'type': 'text',
        #     'display_name': 'Post Media'
        # },
    },
    'id': 'id',
    'displayed_fields': [
        'id', 
        'postTimestamp', 
        'postText',
        'isClickbait',
        # 'targetDescription',
        # 'targetKeywords',
        # 'targetTitle',
        # 'targetCaptions',
        # 'targetParagraphs',
        # 'postMedia',
    ],
    'page_size': 25,
    'filters': [
        {
            'data_field': 'id',
            'description': 'ID',
            'placeholder': 'ID',
            'default_value': '',
        },
        {
            'data_field': 'isClickbait',
            'description': 'Is Clickbait',
            'placeholder': '',
            'default_value': '',
        },
        # {
        #     'data_field': 'majority',
        #     'description': 'Majority',
        #     'placeholder': 'Text Input',
        #     'default_value': '',
        # },
        # {
        #     'data_field': 'retweet_count',
        #     'description': 'Count Retweets',
        #     'placeholder': 'Count Input',
        #     'default_value': '',
        # },
    ],
    'template_html': '''
        <div class="row">
            <div class="col">
                <h1>Tweet <span data-inject_id></span></h1>
                <b>Posted at <span data-inject_timestamp></span></b><br>
                <b>Text:</b> <span data-inject_text></span><br>
                <span data-inject_media></span>

            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12 col-md-6">
                <h2>Annotations</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th class="text-center">Is Clickbait</th>
                            <th class="text-center">Judgements</th>
                            <th class="text-center">Mean</th>
                            <th class="text-center">Median</th>
                            <th class="text-center">Mode</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-center"><span data-inject_is_clickbait></span></td>
                            <td class="text-center"><span data-inject_judgements></span></td>
                            <td class="text-center"><span data-inject_mean></span></td>
                            <td class="text-center"><span data-inject_median></span></td>
                            <td class="text-center"><span data-inject_mode></span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <h2>Targets</h2>
                <h3>Title</h3>
                <span data-inject_target_title></span>
                <h3>Captions</h3>
                <span data-inject_target_captions></span>
                <h3>Keywords</h3>
                <span data-inject_target_keywords></span>
                <h3>Description</h3>
                <span data-inject_target_description></span>
                <h3>Paragraphs</h3>
                <span data-inject_target_paragraphs></span>
            </div>
        </div>
<script type="text/javascript">
    function icon_is_clickbait(is_clickbait)
    {
        if(is_clickbait)
        {
            return '<span class="text-success">Is clickbait</i></span>';
        } else {
            return '<span class="text-danger">No clickbait</span>';
        }
    }

    function render_list(list)
    {
        var result = ''
        for (var i = 0; i < list.length; i++) {
            result += '<p>' + list[i] + '</p>';
        }
        return result
    }
    function media(list_media)
    {
        result = '';
        if(list_media.length > 0)
        {
            result += '<b>Media:</b>'; 
            for (var i = 0; i < list_media.length; i++) {
                
                result += '<div class="card-columns"><div class="card"><img class="card-img" src="/static/clickbait/'+list_media[i]+'" alt="Image"></div></div>';
            }
        }
        return result;
    }

    function create_judgements(list_judgements)
    {
        result = '';
        for (var i = 0; i < list_judgements.length; i++) {
            if(list_judgements[i] < 0.25)
            {
                result += '<div style="margin-right: 5px; margin-left: 5px; display: inline-block; width: 30px; height: 30px; background-color: #00FF00" title="Score: 0"></div>'
            } else if(list_judgements[i] < 0.5) {
                result += '<div style="margin-right: 5px; margin-left: 5px; display: inline-block; width: 30px; height: 30px; background-color: #AAFF00" title="Score: 1/3"></div>'
            } else if(list_judgements[i] < 0.75) {
                result += '<div style="margin-right: 5px; margin-left: 5px; display: inline-block; width: 30px; height: 30px; background-color: #FFAA00" title="Score: 2/3"></div>'
            } else {
                result += '<div style="margin-right: 5px; margin-left: 5px; display: inline-block; width: 30px; height: 30px; background-color: #FF0000" title="Score: 1"></div>'
                
            }
            list_judgements[i]
        }
        return result;
    }

    $('[data-inject_id]').text(obj_item['id'])
    $('[data-inject_timestamp]').text(new Date(obj_item['postTimestamp']).toLocaleString())

    $('[data-inject_text]').html(obj_item['postText']);
    $('[data-inject_media]').html(media(obj_item['postMedia']));
    $('[data-inject_is_clickbait]').html(icon_is_clickbait(obj_item['isClickbait']));
    $('[data-inject_judgements]').html(create_judgements(obj_item['truthJudgments']));
    $('[data-inject_mean]').text(obj_item['truthMean'].toFixed(2));
    $('[data-inject_median]').text(obj_item['truthMedian'].toFixed(2));
    $('[data-inject_mode]').text(obj_item['truthMode'].toFixed(2));

    $('[data-inject_target_title]').text(obj_item['targetTitle']);
    $('[data-inject_target_captions').html(render_list(obj_item['targetCaptions']));
    $('[data-inject_target_keywords').text(obj_item['targetKeywords']);
    $('[data-inject_target_description]').text(obj_item['targetDescription']);
    $('[data-inject_target_paragraphs').html(render_list(obj_item['targetParagraphs']));
</script>''',
}
