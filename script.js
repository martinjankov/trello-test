(function($){
    const $addMoreCards = $('#add-more-cards');
    const $cardArea = $('.card-area');
    const $submitCards = $('#submit-cards');
    const baseUrl = 'https://trello.com/b/';
    const cardIdLength = 8;

    const cardInputTemplate = `
        <div class="card-row">
            <label for="card-link">Enter card link</label>
            <input type="text" id="card-link#id#" class="card-link">
        </div>
    `;

    const addCard = function() {
        const totalCards = $cardArea.find('input').length;
        const cardInputTemplateClone = cardInputTemplate.replace('#id#', totalCards + 1);

        $cardArea.append(cardInputTemplateClone);
    };

    const submitCards = function() {
        const $allCards = $cardArea.find('input');
        const cardData = [];

        $.each($allCards, function(k,v){
            const value = $(v).val();

            const cardId = value.substring(baseUrl.length, baseUrl.length + cardIdLength);

            Trello.cards.get(cardId, [], function(data){
                let labels = [];
                let checklistsArr = [];

                if(data['idChecklists'].length) {
                    checklistsArr = getCheckLists(data['idChecklists']);
                }

                if(data['labels'].length) {
                    labels = formatLabels(data['labels']);
                }

                const cardInfo = {
                    title: data['name'],
                    description: data['desc'],
                    labels: labels,
                    checkList: checklistsArr,
                    cardUrl: data['url']
                }

                cardData.push(cardInfo);
            });
        });

        console.log(cardData);
    };

    const getCheckLists = function(checklist) {
        const checklistsArr = [];

        checklist.forEach(function(id){
            Trello.checklists.get(id, [], function(data){
                let listItems = [];

                if(data['checkItems'].length){
                    listItems = formatListItems(data['checkItems']);
                }

                checklistsArr.push({
                    name: data['name'],
                    items: listItems
                });
            });
        });

        return checklistsArr;
    };

    const formatListItems = function(items){
        const listItems = [];

        items.forEach(function(item){
            listItems.push({
                name: item['name'],
                state: item['state']
            });
        });

        return listItems;
    };

    const formatLabels = function(labes) {
        const labels = [];

        labes.forEach(function(label){
            labels.push({
                name: label['name'],
                color: label['color']
            });
        });

        return labels;
    }

    $addMoreCards.on('click', addCard);
    $submitCards.on('click', submitCards);
})(jQuery)
