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
        console.log('*************** SupaBase ***************');
        console.time('Test GetUser');
        const { data, response } = await apiURL.api.v1[`GetUser/Merlinz`].get();
        console.timeEnd('Test GetUser');

        expect(response.status).toBe(200);
        // console.log(data);
        expect(typeof data).toBe('object');
        // expect(Array.isArray(data)).toBe(true);
    });
    it('Return CreateUser', async () => {
        console.time('Test CreateUser');
        const { data, response } = await apiURL.api.v1.CreateUser.post({
            UserName: "TestName",
            UserID: "Test",
            Password: "1234",
            Mail: "test@gmail.com",
            Role: "User",
            FirstName: "Test",
            LastName: "Test",
            PhoneNumber: "123456789",
            BirthDate: "2000-01-01"
        });
        console.timeEnd('Test CreateUser');

        expect(response.status).toBe(200);
        // console.log(data);
    });
    it('Return Update_UserDetails', async () => {
        console.time('Test Update_UserDetails');
        const { data, response } = await apiURL.api.v1.Update_UserDetails.put({
            UserID: "Test",
            FirstName: "Test",
            LastName: "Test",
            PhoneNumber: "123456789",
            BirthDate: "2000-01-01"
        });
        console.timeEnd('Test Update_UserDetails');

        expect(response.status).toBe(200);
    });
    it('Return Delete_User', async () => {
        console.time('Test Delete_User');
        const { data, response } = await apiURL.api.v1[`Delete_User/Test`].delete();
        console.timeEnd('Test Delete_User');

        expect(response.status).toBe(200);
    });
    // *************** No DB ***************
    it('Return CreateUser_NoDB', async () => {
        console.log('*************** No DB ***************');
        console.time('Test CreateUser_NoDB');
        const { data, response } = await apiURL.api.v1.CreateUser_NoDB.post({
            UserName: "TestName",
            UserID: "Test",
            Password: "1234",
            Mail: "test@gmail.com",
            Role: "User",
            FirstName: "Test",
            LastName: "Test",
            PhoneNumber: "123456789",
            BirthDate: "2000-01-01"
        });
        console.timeEnd('Test CreateUser_NoDB');

        expect(response.status).toBe(200);
    });
    it('Return GetUser_NoDB', async () => {
        console.time('Test GetUser_NoDB');
        const { data, response } = await apiURL.api.v1[`GetUser_NoDB/Test`].get();
        console.timeEnd('Test GetUser_NoDB');

        expect(response.status).toBe(200);
        // console.log(data);
        expect(typeof data).toBe('object');
        // expect(Array.isArray(data)).toBe(true);
    });
    it('Return Update_UserDetails_NoDB', async () => {
        console.time('Test Update_UserDetails_NoDB');
        const { data, response } = await apiURL.api.v1.Update_UserDetails_NoDB.put({
            UserID: "Test",
            FirstName: "Test2",
            LastName: "Test2",
            PhoneNumber: "123456789",
            BirthDate: "2000-01-01"
        });
        console.timeEnd('Test Update_UserDetails_NoDB');

        expect(response.status).toBe(200);
    });
    it('Return Delete_User_NoDB', async () => {
        console.time('Test Delete_User_NoDB');
        const { data, response } = await apiURL.api.v1[`Delete_User_NoDB/Test`].delete();
        console.timeEnd('Test Delete_User_NoDB');

        expect(response.status).toBe(200);
    });
});
