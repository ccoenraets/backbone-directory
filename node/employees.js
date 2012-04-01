
var Sequelize = require("sequelize");

var sequelize = new Sequelize("directory", "root");

var Employee = sequelize.define('Employee', {
	id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true},
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	managerId: Sequelize.STRING,
	department: Sequelize.STRING,
	officePhone: Sequelize.STRING,
	cellPhone: Sequelize.STRING,
	email: Sequelize.STRING,
	city: Sequelize.STRING,
	picture: Sequelize.STRING,
	twitterId: Sequelize.STRING,
	blogURL: Sequelize.STRING

},{
	freezeTableName: true
})

////////////////////////////////////////////////////
var sqlEscape = function(val){
	if(val){
		val = val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function(s) {
	    switch(s) {
	      case "\0": return "\\0";
	      case "\n": return "\\n";
	      case "\r": return "\\r";
	      case "\b": return "\\b";
	      case "\t": return "\\t";
	      case "\x1a": return "\\Z";
	      default: return "\\"+s;
	    }
	  });
	}
	
	return val;	
}


////////////////////////////////////////////////////
var cleanSequelList = function(list){
	var results = [];
	if(list){
		list.forEach(function(item){
			results.push(item.values);
		});
	}
	return results;
}

////////////////////////////////////////////////////
exports.show = function(req, res){
	Employee.find(parseInt(req.params.employee)).success(function(employee){
		//TODO: Some kind of join would be a more efficient way to retrieve the manager info.
		var result = employee.values;
		if(result.managerId>0){
			Employee.find(result.managerId).success(function(manager){
				result.managerFirstName = manager.firstName;
				result.managerLastName = manager.lastName;
				res.json(result);
			});
		}else{
			result.managerFirstName = "";
			result.managerLastName = "";
			res.json(result);
		}
	});
};

exports.search = function(req, res){
	var query = sqlEscape(req.params["query"]);
	Employee.findAll({where: "firstName like '" + query + "%' or lastName like '" + query + "%'", order:"lastName, firstName"}).success(function(employees){
		res.json(cleanSequelList(employees));
	})
}

exports.reports = function(req, res){
	var managerId = sqlEscape(req.params["employee"]);
	Employee.findAll({where: {"managerId":managerId}, order:"lastName, firstName"}).success(function(employees){
		res.json(cleanSequelList(employees));
	})
}



exports.index = function(req, res){
	Employee.findAll({order:"lastName, firstName"}).success(function(employees){
		res.json(cleanSequelList(employees));
	})
};

exports.new = function(req, res){
	res.send('new employee');
};

exports.create = function(req, res){
	res.send('create employee');
};


exports.edit = function(req, res){
	res.send('edit employee ' + req.params.employee);
};

exports.update = function(req, res){
	res.send('update employee ' + req.params.employee);
};

exports.destroy = function(req, res){
	res.send('destroy employee ' + req.params.employee);
};




