const request = require('supertest')
const app = require('../app')


const { sequelize } = require('../models')
const queryInterface = sequelize.getQueryInterface()

const item = require('../data/item.json')
const category = require('../data/category.json')

beforeAll(async () => {
    // item
    item.forEach(el => {
        delete el.id
        el.updatedAt = el.createdAt = new Date()
    })

    category.forEach(el => {
        delete el.id
        el.createdAt = el.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Categories', category, {})
    await queryInterface.bulkInsert('Items', item, {})
})

afterAll(async () => {
    await queryInterface.bulkDelete('Categories', null, { truncate: true, cascade: true, restartIdentity: true })
    await queryInterface.bulkDelete('Items', null, { truncate: true, cascade: true, restartIdentity: true })
})

// category
describe('POST /', () => {
    describe('POST / - succeed', () => {
        it(`should be return message Success add Categories`, async () => {
            const response = await request(app)
                .post('/')
                .send({
                    name: 'test',
                    imgUrl: 'test imgUrl'
                })

            expect(response.status).toBe(201)
            expect(response.body.message).toBe('Success add Category')
        })
    })
    describe('POST / - failed', () => {
        it(`should be return error message because name is empty`, async () => {
            const response = await request(app)
                .post('/')
                .send({
                    name: '',
                    imgUrl: 'test imgUrl'
                })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('name is required')
        })
    })
    describe('POST / - failed', () => {
        it(`should be return error message because imgUrl is empty`, async () => {
            const response = await request(app)
                .post('/')
                .send({
                    name: 'test',
                    imgUrl: ''
                })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('imgUrl is required')
        })
    })


    // PUT
    describe('PUT /:id - succeed', () => {
        it(`should be return an message success update categories`, async () => {
            const response = await request(app)
                .put('/8')
                .send({
                    name: 'test',
                    imgUrl: 'testing update'
                })

            expect(response.status).toBe(200)
            expect(response.body.message).toBe('Success update Category')
        })
    })
    describe('PUT /:id - failed', () => {
        it(`should be return an error message because imgUrl is empty`, async () => {
            const response = await request(app)
                .put('/8')
                .send({
                    name: 'test',
                    imgUrl: ''
                })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('imgUrl is required')
        })
    })
    describe('PUT /:id - failed', () => {
        it(`should be return an error message because name is empty`, async () => {
            const response = await request(app)
                .put('/8')
                .send({
                    name: '',
                    imgUrl: 'testing update'
                })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('name is required')
        })
    })
    describe('PUT /:id - failed', () => {
        it(`should be return an error message because id is not found`, async () => {
            const response = await request(app)
                .put('/100')
                .send({
                    name: 'test',
                    imgUrl: 'testing update'
                })

            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Data not found')
        })
    })

    //DELETE
    describe('DELETE /:id - succeed', () => {
        it(`should be return an error message Success delete Category`, async () => {
            const response = await request(app)
                .delete('/8')

            expect(response.status).toBe(200)
            expect(response.body.message).toBe('Success delete Category')
        })
    })
    describe('DELETE /:id - failed', () => {
        it(`should be return an error message Data not found`, async () => {
            const response = await request(app)
                .delete('/100')

            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Data not found')
        })
    })
})



// items
describe('POST /items', () => {
    describe('POST /items - succeed', () => {
        it('should be return an message Success add Items', async () => {
            const response = await request(app)
                .post('/items')
                .send({
                    name: 'test',
                    CategoryId: 3
                })

            expect(response.status).toBe(201)
            expect(response.body.message).toBe('Success add Item')
        })
    })
    describe('POST /items - failed', () => {
        it('should be return an error message because name is empty', async () => {
            const response = await request(app)
                .post('/items')
                .send({
                    name: '',
                    CategoryId: 3
                })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('name is required')
        })
    })
    describe('POST /items - failed', () => {
        it('should be return an error message because Categoryid is empty', async () => {
            const response = await request(app)
                .post('/items')
                .send({
                    name: 'test',
                })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('CategoryId is required')
        })
    })


    // PUT
    describe('PUT /items/:id - succeed', () => {
        it('should be return an message suceed add item', async () => {
            const response = await request(app)
                .put('/items/9')
                .send({
                    name: 'test',
                    CategoryId: 5
                })

            expect(response.status).toBe(200)
            expect(response.body.message).toBe('Success update Items')
        })
    })
    describe('PUT /items/:id - failed', () => {
        it('should be return an error message because name is empty', async () => {
            const response = await request(app)
                .put('/items/9')
                .send({
                    name: '',
                    CategoryId: 5
                })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('name is required')
        })
    })
    describe('PUT /items/:id - failed', () => {
        it('should be return an error message because CategoryId is empty', async () => {
            const response = await request(app)
                .put('/items/9')
                .send({
                    name: 'test',
                    CategoryId: ''
                })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('CategoryId is required')
        })
    })
    describe('PUT /items/:id - failed', () => {
        it('should be return an error message because Data not found', async () => {
            const response = await request(app)
                .put('/items/100')
                .send({
                    name: 'test',
                    CategoryId: '4'
                })

            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Data not found')
        })
    })


    //DELETE
    describe('DELETE /items/:id - succeed', () => {
        it('should be return an message Success Delete Item', async () => {
            const response = await request(app)
                .delete('/items/2')
            expect(response.status).toBe(200)
            expect(response.body.message).toBe('Success delete Category')
        })
    })
    describe('DELETE /items/:id - failed', () => {
        it('should be return an error message because Data not found', async () => {
            const response = await request(app)
                .delete('/items/100')
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Data not found')
        })
    })
})