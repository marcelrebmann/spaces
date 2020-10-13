const mongoose = require("mongoose");
const express = require("express");
const app = express();
const BodyParser = require("body-parser");
const cors = require("cors");

//Enable Cross-Origin Resource Sharing
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

const url = "mongodb://localhost:27017/spaces";
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    user: "spaces",
    pass: "sp123-U"
});

const db = mongoose.connection;
db.once("open", function () {
    console.log("Connected with MongoDB instance at " + url);
})

//Data type definition for a Module
const moduleSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }
    //Automatically added by MongoDB:
    //_id: String
    //__v: Number
})

//Data type definiton for a Column
const columnSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    limit: Number
    //Automatically added by MongoDB:
    //_id: String
    //__v: Number
})

//Data type definition for a Task
const taskSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    //Foreign keys
    column: { type: mongoose.Schema.Types.ObjectId, ref: "Column" },
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" }
    //Automatically added by MongoDB:
    //_id: String
    //__v: Number
})

const Task = mongoose.model("Task", taskSchema);

//Pre hook before deleteOne ensures that all tasks referring to the model are deleted beforehand
moduleSchema.pre("deleteOne", async function (next) {
    let result = await Task.deleteMany({ module: this._conditions._id }).exec();
    console.log("Pre hook deleted " + result.n + " task(s) for module " + this._conditions._id);
    next();
});

const Module = mongoose.model("Module", moduleSchema);

//Pre hook before deleteOne ensures that a column can not be deleted if there are still tasks referring to it
columnSchema.pre("deleteOne", async function (next) {
    if ((await Task.find({ column: this._conditions._id }).exec()).length > 0) {
        throw new Error("Column still contains entries!");
    }
    next();
})

const Column = mongoose.model("Column", columnSchema);

//All data in the body of any HTTP request is parsed as JSON
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//CREATE
app.post("/modules", async (request, response) => {
    try {
        const module = new Module(request.body);
        const result = await module.save();
        response.status(201).send(result);
        console.log("Module " + result.name + " created.");
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/columns", async (request, response) => {
    try {
        const column = new Column(request.body);
        const result = await column.save();
        response.status(201).send(result);
        console.log("Column " + result.name + " created.");
    } catch (error) {
        reponse.status(500).send(error);
    }
});
app.post("/tasks", async (request, response) => {
    try {
        const task = new Task(request.body);
        const result = await task.save();
        response.status(201).send(result);
        console.log("Task " + result.name + " created.");
    } catch (error) {
        response.status(500).send(error);
    }
});

//READ
app.get("/modules/:id", async (request, response) => {
    try {
        const module = await Module.findById(request.params.id).exec();

        //Not found
        if (!module) {
            response.status(404);
            console.log("Module " + request.params.id + " not found.");
            response.send();
        } else {
            response.send(module);
            console.log("Module " + module.name + " retrieved.")
        }
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/columns/:id", async (request, response) => {
    try {
        const column = await Column.findById(request.params.id).exec();

        //Not found
        if (!column) {
            response.status(404);
            console.log("Column " + request.params.id + " not found.");
            response.send();
        } else {
            response.send(column);
            console.log("Column " + column.name + " retrieved.")
        }
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/tasks/:id", async (request, response) => {
    try {
        const task = await Task
            .findById(request.params.id)
            //Populate loads referenced column object  
            .populate("column")
            //Populate loads referenced module object
            .populate("module")
            .exec();

        //Not found    
        if (!task) {
            response.status(404);
            console.log("Task " + request.params.id + " not found.");
            response.send();
        }
        response.send(task);
        console.log("Task " + task.name + " retrieved.");
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/modules", async (request, response) => {
    try {
        const result = await Module.find().exec();
        response.send(result);
        console.log("All modules retrieved.");
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/columns", async (request, response) => {
    try {
        const result = await Column.find().exec();
        response.send(result);
        console.log("All columns retrieved.");
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/tasks", async (request, response) => {
    try {
        const result = await Task.find().exec();
        response.send(result);
        console.log("All tasks retrieved.");
    } catch (error) {
        response.status(500).send(error);
    }
})

//UPDATE
app.put("/modules/:id", async (request, response) => {
    try {
        const module = await Module.findById(request.params.id).exec();

        //Not found    
        if (!module) {
            response.status(404);
            console.log("Module " + request.params.id + " not found.");
            response.send();
        } else {
            module.set(request.body);
            const result = await module.save();
            response.send(result);
        }
        console.log("Module " + modul.name + " updated.");
    } catch (error) {
        response.status(500).send(error);
    }
});

app.put("/columns/:id", async (request, response) => {
    try {
        const column = await Column.findById(request.params.id).exec();

        //Not found    
        if (!column) {
            response.status(404);
            console.log("Column " + request.params.id + " not found.");
            response.send();
        } else {

            column.set(request.body);
            const result = await column.save();
            response.send(result);
            console.log("Column " + column.name + " updated.");
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

app.put("/tasks/:id", async (request, response) => {
    try {
        const task = await Task.findById(request.params.id).exec();

        //Not found    
        if (!task) {
            response.status(404);
            console.log("Task " + request.params.id + " not found.");
            response.send();
        } else {
            task.set(request.body);
            const result = await task.save();
            response.send(result);
            console.log("Task " + task.name + " updated.");
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//DELETE
app.delete("/modules/:id", async (request, response) => {
    try {
        const result = await Module.deleteOne({ _id: request.params.id }).exec();


        if (result.n == 0) {
            console.log("Module " + request.params.id + " not found.");
            response.status(404).send();
        } else {
            response.send(result);
            console.log("Module " + request.params.id + " and related tasks deleted.");
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

app.delete("/columns/:id", async (request, response) => {
    try {
        const result = await Column.deleteOne({ _id: request.params.id }).exec();

        if (result.n == 0) {
            console.log("Column " + request.params.id + " not found.");
            response.status(404).send();
        } else {
            response.send(result);
            console.log("Empty Column " + request.params.id + " deleted.");
        }
    } catch (error) {
        if (error.message == "Column still contains entries!") {
            response.status(403).send(error);
            console.log("Column deletion aborted for " + request.params.id + ": " + error.message);
        } else {
            response.status(500).send(error);
        }
    }
});


app.delete("/tasks/:id", async (request, response) => {
    try {
        const result = await Task.deleteOne({ _id: request.params.id }).exec();
        if (result.n == 0) {
            console.log("Task " + request.params.id + " not found.");
            response.status(404).send();
        } else {
            response.send(result);
            console.log("Task " + request.params.id + " deleted.");
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log("REST server is listening on port 3000")
});
