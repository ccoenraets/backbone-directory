//We wrap mongoose so that you don't have to include mongoose twice once in the mongoose rest and once here.
//If I where really smart I would figure out a better way.

module.exports = function(mongoose) {
    var Schema = mongoose.Schema;
    var EmployeeSchema = new Schema({
        id_:{type:Number},
        firstName:{type:String},
        lastName:{type:String},
        managerId_:Number,
        title:{type:String},
        department:{type:String},
        officePhone:{type:String},
        cellPhone:{type:String},
        email:{type:String},
        city:{type:String},
        picture:{type:String},
        twitterId:{type:String},
        blogUrl:{type:String},
        manager:{type:Schema.ObjectId, ref:"employee"}, //keep track of the employee
        reports:[
            {type:Schema.ObjectId, ref:"employee"} //keep track of the reports.
        ]
    });

    EmployeeSchema.pre('save', function (next) {
        next();
    });
    //This will be exposed as /api/employees/search/Stuff
    EmployeeSchema.statics.search = function(q, term) {
        var regex = {$regex:new RegExp(term || q.term, 'i')}
        return this.find({}).or([
            {firstName:regex},
            {lastName:regex},
            {twitterId:regex},
            {description:regex}
        ]);

    }
    var Employee = mongoose.model('employee', EmployeeSchema);

    return Employee;
};