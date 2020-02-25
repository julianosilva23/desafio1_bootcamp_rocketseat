express = require('express');

const app = express();

var projectManager = [];
var numberRequests = 0;

// utilizando json
app.use(express.json());
app.use(countRequest);

app.get('/projects', (req, res) => {
    return res.json(projectManager);
});

app.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const tasks = [];

    projectManager.push({ id, title, tasks});

    return res.json({ id, title, tasks})
});

app.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const projectIndex = projectManager.findIndex(project => project.id == id);

    projectManager[projectIndex]['title'] = title;

    return res.json(projectManager[projectIndex])
});

app.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projectManager.findIndex(project => project.id == id);

    projectManager.splice(projectIndex, 1)

    return res.json()
})

app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    if(!title) {
        return res.status(400).json({message: 'Title is required'});
    }

    projectManager = projectManager.map((project) => {
        if(project.id == id) {
            project['tasks'].push(title)
        }

        return project;
    })

    return res.json(projectManager)  
});

function checkProjectExists(req, res, next) {

    const { id } = req.params;

    const projectIndex = projectManager.findIndex(project => project.id == id);

    if(projectIndex === -1) {

        return res.status(400).json({message: 'Project does not exist'});
    }

    return next();
}

function countRequest(req, res, next) {
    numberRequests++;

    console.log(`Were made ${numberRequests} requests on API`)

    return next()

}

app.listen(3001);