import { describe, expect, it } from 'bun:test';
import { edenTreaty } from '@elysiajs/eden';
import { app } from '../index';

const apiURL = edenTreaty<typeof app>('http://localhost:5000') as any;

describe('Elysia', () => {
    it('Return FindMean via only x', async () => {
        console.time('Test FindMean via only x');
        const { data, response } = await apiURL.api.v1.FindMean.post({
            x: [21, 33, 40, 59], w: []
        });
        console.timeEnd('Test FindMean via only x');

        expect(response.status).toBe(200);
        expect(data).toBe(38.25);
    });

    it('Return FindMean via x and w', async () => {
        console.time('Test FindMean via x and w');
        const { data, response } = await apiURL.api.v1.FindMean.post({
            x: [10, 20, 30], w: [1, 2, 3]
        });
        console.timeEnd('Test FindMean via x and w');

        expect(response.status).toBe(200);
        expect(data).toBe(23.33);
    });
    it('Return GetUser', async () => {
        console.time('Test GetUser');
        const { data, response } = await apiURL.api.v1[`GetUser/Merlinz`].get();
        console.timeEnd('Test GetUser');

        expect(response.status).toBe(200);
        // console.log(data);
        expect(typeof data).toBe('object');
        // expect(Array.isArray(data)).toBe(true);
    });
});
