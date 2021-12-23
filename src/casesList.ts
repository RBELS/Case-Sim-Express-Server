import { CaseType } from './types/casesTypes';
// import { Collection } from 'mongodb';
import { Router } from 'express'
import { baseImgUrl } from './instances'

const casesList = Router();

casesList.get('/:id?', async(req, res) => {
    const { cases } = req.app.locals;

    if (!req.params.id) {
        const casesArray: CaseType[] = await cases.find({ show: true }).toArray();
        const casesToSend = casesArray.map(({ _id, id, name, avatar, price }) => ({ _id, id, name, avatar: mapAvatar(avatar), price }));
        res.status(200).json(casesToSend);
        return;
    }

    const caseid = parseInt(req.params.id);
    const caseObj: CaseType = await cases.findOne({ id: caseid });
    if (!caseObj) {
        res.status(200).json({ error: 'Not Found.' }).end();
        return;
    }

    caseObj.avatar = mapAvatar(caseObj.avatar);

    res.status(200).json({
        ...caseObj,
        items: caseObj.items.map((item => ({...item, avatar: `${baseImgUrl}/img/${caseObj.name}/${item.id}.${caseObj.ext}` })))
    });
});

function mapAvatar(avatar: string): string {
    debugger

    if(avatar.substr(0,4) === 'http') {
        return avatar;
    }

    return `${baseImgUrl}${avatar}`;
}


export default casesList