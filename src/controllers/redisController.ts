// controllers/itemController.ts

import { Request, Response } from 'express';
import { connectRedis } from '../utils/redis';

export const createRedisDatas = async (req: Request, res: Response) => {
    try {
        //LOGIC

        let newData = {
            "name": "athul", "age": "20", "gender": "male"
        }

        let client: any = await connectRedis();

        const value = await client.get('1');

        res.status(200).send(newData);

    } catch (error: any) {
        res.status(500).send('1. Server Error');
    }
};


export const postRedisDatas = async (req: Request, res: Response) => {

    let id = req?.body?.id
    let data_type = req?.body?.datatype
    let data = req?.body?.data
    let type = req?.body?.type



    if (data_type == "string") {


        try {

            let client: any = await connectRedis()

            await client.set(id, data);   // (value will be set curresponding to the key)   
            // await client.set(id, data, { EX: 10 });   // (Expire in 10 seconds)
            // await client.set(id, data, { PX: 10000 });   // (Expiration in milliseconds)
            // await client.set(id, data, { NX: true });   // (value is set only if the key doesn't exist)
            // await client.set(id, data, { XX: true });   // (value is set only if the key already exist)
            // await client.set(id, data, { GET: true });   // (value is set only if the key already exist)

            // await client.set(id, data, { EX: 10, NX: true });   // (Expire in 10 seconds and value will be set only if the key doesn't exist)
            // await client.set(id, data, { PX: 10000, XX: true });   // (Expire in 10 seconds and value will be set only if the key already exist)

            // let objectData = {
            //     'name': "nikhil", 'rollno': 10, 'address': 'good address'
            // }
            // await client.set(id, JSON.stringify(objectData));
            // const value = JSON.parse(await client.get(id)) 


            // await client.append(id, data); // append to the  current value
            // const count = await client.bitCount(id); // Outputs the number of set bits in 'value'
            // console.log("count--->>>>>>>>", count)
            // await client.getRange('mykey', 0, 4); // Outputs: 'Hello'
            // await client.setRange('mykey', 6, 'Redis'); // Outputs: 'Hello Redis'
            // await client.mSet('key1', 'value1', 'key2', 'value2'); // multiple keys to multiple values


            const value = await client.get(id)

            res.status(200).send(value);
            await client.disconnect();

        } catch (error) {
            console.log("2. Server Error", error)
            res.status(500).send('2. Server Error');
        }

    }

    else if (data_type == "hash") {

        try {

            let client: any = await connectRedis()

            let id = req?.body?.id
            let user_type = req?.body?.user_type
            let user_id = `${user_type}:${id}`
            let data = req?.body?.data
            let name_value = req?.body?.data?.name


            // Set a hash value
            await client.hSet(user_id, data); // values are set curresponding to the id
            // await client.hSet(user_id, 'name', name_value); // name is updated curresponding to the id.

            // Get a hash value
            // const value = await client.hGetAll(user_id);    // HGET returns result. // HMGET returns array of values 
            // const value = await client.hGet(user_id,'email');    // HGET returns result. 
            // const value = await client.hmGet(user_id,['name','email']); // HMGET returns array of values 
            // const value = await client.hVals(user_id); // get array of values as results
            // const value = await client.hRandField(user_id); //get random keys
            const value = await client.hRandField(user_id, 2, { withValues: true });

            res.status(200).send(value);
            await client.disconnect();

        } catch (error) {
            console.log("2. Server Error", error)
            res.status(500).send('2. Server Error');
        }

    }

    else if (data_type == "lists") {

        try {

            let client: any = await connectRedis()
            // await client.lPush('tasks','task1');  // //there is lpush(left push) and rpush (right push)  

            let value: string = ''

            if (type == 'push') {
                await client.lPush(id, 'task14');
                await client.lPush(id, 'task15');
                await client.lPush(id, 'task16');
                await client.lPush(id, 'task17');
                await client.lPush(id, 'task18');
                await client.lPush(id, 'task19');
                await client.lPush(id, 'task20');
                await client.lPush(id, 'task22');
                await client.lPush(id, 'task23');
                await client.lPush(id, 'task24');
                await client.lPush(id, 'task25');
                await client.lPush(id, 'task26');
                await client.lPush(id, 'task27');
                await client.lPush(id, 'task28');
                await client.lPush(id, 'task29');
                await client.lPush(id, 'task30');
            } else {

                value = await client.lPop(id);  // lpop and rpop

            }



            res.status(200).send(value?.toString());
            await client.disconnect();

        } catch (error) {
            console.log("2. Server Error", error)
            res.status(500).send('2. Server Error');
        }

    }

    else if (data_type == "sets") {

        try {

            let client: any = await connectRedis()

            await client.sAdd(id, data);

            await client.sRem(id, 'two');

            const members = await client.sMembers('myset'); // Outputs: ['one', 'three']

            const count = await client.sCard('myset'); // Outputs: 2 Gets the number of members in a set.

            // await client.sAdd('set1', 'one', 'two');
            // await client.sAdd('set2', 'three');
            // await client.sMove('set1', 'set2', 'one');
            // const set1Members = await client.sMembers('set1'); // Outputs: ['two']
            // const set2Members = await client.sMembers('set2'); // Outputs: ['three', 'one']

            // Clears all data in Redis asynchronously
            // await client.flushAll('ASYNC');

            let value = await client.sMembers('visitors') // return values inside the set

            res.status(200).send(value.toString());
            await client.disconnect();

        } catch (error) {
            console.log("2. Server Error", error)
            res.status(500).send('2. Server Error');
        }

    }

    else if (data_type == "sorted_sets") {

        let param1 = req?.body?.param1
        let param2 = req?.body?.param2
        let data = req?.body?.data
        let id = req?.body?.id

        try {

            let client: any = await connectRedis()

            await client.zAdd(id,data);
            let value = await client.zRangeWithScores(id, param1, param2);

            value = JSON.parse(value)

            res.status(200).send(value);
            await client.disconnect();

        } catch (error) {
            console.log("2. Server Error", error)
            res.status(500).send('2. Server Error');
        }

    }


};


export const getRedisDatas = async (req: Request, res: Response) => {


    let data_type = req?.body?.datatype
    let data = req?.body?.data



    if (data_type == "string") {
        try {
            let id = req?.body?.id

            let client: any = await connectRedis()


            const value = await client.get(id);

            res.status(200).send(value);
            await client.disconnect();

        } catch (error) {
            console.log("2. Server Error", error)
            res.status(500).send('2. Server Error');
        }

    }

    else if (data_type == "hash") {

        try {

            let client: any = await connectRedis()

            let id = req?.body?.id
            let user_type = req?.body?.user_type
            // let data = req?.body?.data
            let user_id = `${user_type}:${id}`

            let value = await client.hGetAll(user_id);    // HGET returns single value. // HMGET returns array of values 

            res.status(200).send(value);
            await client.disconnect();

        } catch (error) {
            console.log("2. Server Error", error)
            res.status(500).send('2. Server Error');
        }

    }

    else if (data_type == "lists") {

        try {

            let id = req?.body?.id
            let client: any = await connectRedis()
            let value = await client.lLen(id);  // lpop and rpop

            console.log(value.toString(), " left in the stack.");
            res.status(200).send(value.toString());
            await client.disconnect();

        } catch (error) {
            console.log("2. Server Error", error)
            res.status(500).send('2. Server Error');
        }

    }

    else if (data_type == "sets") {

        try {

            let id = req?.body?.id
            let client: any = await connectRedis()

            let value = await client.sMembers(id) // return values inside the set

            // let value = await client.sCard('visitors'); // return counts inside the set
            // let value = await client.sisMember('visitors','user3'); // return counts inside the set
            // console.log("valuevaluevalue------>>>>>>>", value);

            res.status(200).send(value.toString());
            await client.disconnect();

        } catch (error) {
            console.log("2. Server Error", error)
            res.status(500).send('2. Server Error');
        }

    }

    else if (data_type == "sorted_sets") {

        let param1 = req?.body?.param1
        let param2 = req?.body?.param2
        let data = req?.body?.data
        let id = req?.body?.id

        try {

            let client: any = await connectRedis()


            await client.zAdd(id,data);
            let value = await client.zRangeWithScores(id, param1, param2);
            
            // value = JSON.parse(value)
            res.status(200).send(value);
            await client.disconnect();

        } catch (error) {
            console.log("2. Server Error", error)
            res.status(500).send('2. Server Error');
        }

    }

};





