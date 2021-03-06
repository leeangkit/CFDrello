import {DateActionCards} from '../models/dateActionCards'
import {Actions} from '../models/actions'
import {convertDates} from './convertDates'

export const createDateActionCards = async(dateStart,dashboard) => {
    const now = new Date()
    let countBack = 0 
    let countInpr = 0
    let countComp = 0
    const findDateAction = await DateActionCards.find({idDashboard:dashboard._id})
    const lenFind = findDateAction.length
    if(lenFind>2){
        dateStart = new Date(findDateAction[lenFind-2].date)
        countBack = findDateAction[lenFind-3].countBack
        countInpr = findDateAction[lenFind-3].countInpr
        countComp = findDateAction[lenFind-3].countComp
    }
    now.setDate(now.getDate() + 1)
    for (let d = new Date(dateStart); d <= now; d.setDate(d.getDate() + 1)) {
        const ymd = await convertDates(d)
        const dataThisDay =  await Actions.find({dateString: ymd}).sort({date:1})
        const len = dataThisDay.length
        const listBack = dashboard.listBack
        const listInpr = dashboard.listInpr
        const listComp = dashboard.listComp
        let dateAction = d
        for(let i=0;i<len;i++){
            const data = dataThisDay[i].data
            if(dataThisDay[i].type=="createCard" || dataThisDay[i].type=="moveCardToBoard"|| dataThisDay[i].type== "copyCard" || dataThisDay[i].type== "convertToCardFromCheckItem"||dataThisDay[i].type=="emailCard"){
                if (listBack.indexOf(data.list.id) != -1) countBack++
                else if (listInpr.indexOf(data.list.id) != -1) countInpr++
                else if (listComp.indexOf(data.list.id) != -1) countComp++
                dateAction = dataThisDay[i].date
            }
            else if(dataThisDay[i].type=="updateCard" && data.listAfter && data.listBefore){
                if (listBack.indexOf(data.listAfter.id) != -1) countBack++
                else if (listInpr.indexOf(data.listAfter.id) != -1) countInpr++
                else if (listComp.indexOf(data.listAfter.id) != -1) countComp++
                
                if (listBack.indexOf(data.listBefore.id) != -1) countBack--
                else if (listInpr.indexOf(data.listBefore.id) != -1) countInpr--
                else if (listComp.indexOf(data.listBefore.id) != -1) countComp--
                dateAction = dataThisDay[i].date
            }
            else if(dataThisDay[i].type=="updateCard" && data.card.closed == false && data.old.closed == true){ 
                if (listBack.indexOf(data.list.id) != -1) countBack++
                else if (listInpr.indexOf(data.list.id) != -1) countInpr++
                else if (listComp.indexOf(data.list.id) != -1) countComp++
                dateAction = dataThisDay[i].date
            }
            else if(dataThisDay[i].type=="updateCard" && data.card.closed == true && data.old.closed == false){ 
                if (listBack.indexOf(data.list.id) != -1) countBack--
                else if (listInpr.indexOf(data.list.id) != -1) countInpr--
                else if (listComp.indexOf(data.list.id) != -1) countComp--
                dateAction = dataThisDay[i].date
            }
            else if(dataThisDay[i].type=="moveCardFromBoard"){ 
                if (listBack.indexOf(data.list.id) != -1) countBack--
                else if (listInpr.indexOf(data.list.id) != -1) countInpr--
                else if (listComp.indexOf(data.list.id) != -1) countComp--
                dateAction = dataThisDay[i].date
            }
        }
        const allData = {
            date: dateAction,
            dateString: ymd,
            countBack: countBack,
            countInpr: countInpr,
            countComp: countComp,
            idDashboard: dashboard._id
        }
        const dateActionCards = await DateActionCards.findOne({ dateString: allData.dateString, idDashboard: allData.idDashboard})
        const callDateActionCards = await createnewDateActionCards(DateActionCards,allData,dateActionCards)
    }
}

export const createnewDateActionCards = async (DateActionCards,allData,dateActionCards) => {
    if (!dateActionCards) {
        const newDateActionCards = await DateActionCards.create(allData)
        return newDateActionCards
    }
    else if (allData.countBack != dateActionCards.countBack || allData.countInpr != dateActionCards.countInpr || allData.countComp != dateActionCards.countComp ) {
        const newDateActionCards = await DateActionCards.update({_id: dateActionCards._id},{$set:{
            countBack: allData.countBack,
            countInpr: allData.countInpr,
            countComp: allData.countComp
        }})
        return newDateActionCards
    } 
    else
        return false
}

