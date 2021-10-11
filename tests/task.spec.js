const request = require('supertest');

const routes = {
    url: 'https://node-task-service.herokuapp.com',
    task: '/v1/task',
}

let taskId;

describe(`POST ${routes.task}`, () => {
    test('it should return bad request when required field are not filled or empty', async () => {
        const response = await request(routes.url)
        .post(routes.task)
        .send({
            task: ''
        })
     
        expect(response.statusCode || response.body.code).toBe(400);
        expect(response.body.status).toBe('ERROR')
        expect(response.body.message).toMatch(/required|empty/)
        expect(response.body.data).toBe(null);
    })

    test('it should return success when task inserted', async () => {
        const response = await request(routes.url)
        .post(routes.task)
        .send({
            task: 'test task'
        })
     
        expect(response.statusCode || response.body.code).toBe(201);
        expect(response.body.status).toBe('SUCCESS')
        expect(response.body.message).toBe('CREATED')
        expect(response.body.data.task).toBe('test task');

        taskId = response.body.data.id
    })
})

describe(`GET ${routes.task}`, () => {
    test('it should return array of tasks', async () => {
        const response = await request(routes.url)
        .get(routes.task)
     
        expect(response.statusCode || response.body.code).toBe(200);
        expect(response.body.status).toBe('SUCCESS')
        expect(response.body.message).toBe('OK')
        expect(response.body.data).toEqual(expect.arrayContaining([
            expect.objectContaining({ task: 'test task' }),
        ]));
    })
})

describe(`GET ${routes.task}/:id`, () => {
    test('it should return task', async () => {
        const response = await request(routes.url)
        .get(routes.task+'/'+taskId)
     
        expect(response.statusCode || response.body.code).toBe(200);
        expect(response.body.status).toBe('SUCCESS')
        expect(response.body.message).toBe('OK')
        expect(response.body.data).toEqual(expect.objectContaining({ 
            id: taskId,
            task: 'test task' 
        }));
    })

    test('it should return Task not found', async () => {
        const response = await request(routes.url)
        .get(routes.task+'/9999')
     
        expect(response.statusCode || response.body.code).toBe(404);
        expect(response.body.status).toBe('ERROR')
        expect(response.body.message).toBe('Task not found')
    })
})

describe(`PUT ${routes.task}/:id`, () => {
    test('it should return Task not found', async () => {
        const response = await request(routes.url)
        .put(routes.task+'/9999')
     
        expect(response.statusCode || response.body.code).toBe(404);
        expect(response.body.status).toBe('ERROR')
        expect(response.body.message).toBe('Task not found')
    })

    test('it should return Success', async () => {
        const response = await request(routes.url)
        .put(routes.task+'/'+taskId)
        .send({
            task: 'updated from automated test',
            status: 1
        })
     
        expect(response.statusCode || response.body.code).toBe(201);
        expect(response.body.status).toBe('SUCCESS')
        expect(response.body.message).toBe('CREATED')
        expect(response.body.data).toEqual(expect.arrayContaining([1]));
    })
})

describe(`DELETE ${routes.task}/:id`, () => {
    test('it should return Task not found', async () => {
        const response = await request(routes.url)
        .delete(routes.task+'/9999')
     
        expect(response.statusCode || response.body.code).toBe(404);
        expect(response.body.status).toBe('ERROR')
        expect(response.body.message).toBe('Task not found')
    })

    test('it should return Success', async () => {
        const response = await request(routes.url)
        .delete(routes.task+'/'+taskId)
     
        expect(response.statusCode || response.body.code).toBe(200);
        expect(response.body.status).toBe('SUCCESS')
        expect(response.body.message).toBe('OK')
        expect(response.body.data).toEqual(1);
    })
})