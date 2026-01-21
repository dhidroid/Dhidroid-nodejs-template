import request from 'supertest';
import app from '../src/app';

describe('App', () => {
    it('GET / should return 200', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('API is running successfully');
    });
});
