

async function paginating(limit, currentPage, schema)
{
    let offset = limit * (currentPage - 1);
    let assemblage = await schema.paginate({}, {offset: offset, limit: limit}).then({});
    return assemblage.docs;
}

function createPageArray(pageCount, currentPage)
{
    let pageArray = new Array();
    for (let i = 1; i <= pageCount; i++) {
        pageArray[i] = {
            number: i,
            current: false
        };
    }
    pageArray[currentPage].current = true;
    return pageArray;
}

module.exports = {
    paginating: paginating,
    createPageArray: createPageArray
};