import mongoose from 'mongoose'
import { dbCFDrello } from './index'

const ListsSchema = mongoose.Schema({
    id: String,
    name: String,
    idBoard: String
});

export const Lists = mongoose.model('Lists', ListsSchema);


