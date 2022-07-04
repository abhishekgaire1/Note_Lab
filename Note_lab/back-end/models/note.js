var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var noteSchema = new Schema(
    {
        
        _id: Number,
        id:Number,
        body: String,
        time: String,
        tags: [{id:String,
            text: String,
        }],
        agent: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    }
);

//Export model
module.exports = mongoose.model('note_model', noteSchema);