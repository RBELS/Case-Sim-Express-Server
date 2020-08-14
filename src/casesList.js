const { Router } = require('express');
const { baseImgUrl } = require('./instances');

const casesList = new Router();

casesList.get('/:id?', async(req, res) => {
    const { cases } = req.app.locals;

    if (!req.params.id) {
        const casesArray = await cases.find({ show: true }).toArray();
        const casesToSend = casesArray.map(({ _id, id, name, avatar, price }) => ({ _id, id, name, avatar, price }));
        res.status(200).json(casesToSend);
        return;
    }

    const caseid = parseInt(req.params.id);
    const caseObj = await cases.findOne({ id: caseid });
    if (!caseObj) {
        res.status(200).json({ error: 'Not Found.' }).end();
        return;
    }

    res.status(200).json({
        ...caseObj,
        items: caseObj.items.map((item => ({...item, avatar: `${baseImgUrl}/img/${caseObj.name}/${item.id}.${caseObj.ext}` })))
    });
});


module.exports = casesList;