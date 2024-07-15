// controllers/itemController.ts

import { Request, Response } from 'express';
import Item from '../model/item';
import itemSchema from '../validators/itemValidator';
import { array } from 'joi';

export const createItem = async (req: any, res: Response) => {
  try {
    const { error } = itemSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let data: any = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    }

    if (req.files.length > 0) {
      data.images = req.files
    }

    const newItem = await Item.create(data);
    res.json(newItem);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

export const getItems = async (_req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = itemSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) return res.status(404).send('Item not found');

    res.json(updatedItem);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).send('Item not found');

    res.json(deletedItem);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};



export const jsFunctions = async (req: Request, res: Response) => {
  try {
    const { types } = req.body;
    let data = ''
    // let sArray:any =[]








    if (types == 'closure') {






      function init() {


        let name = "Javascript Closure";  

        function displayName() {         
          console.log(name);  
        }


        displayName(); 





      }

      init();

    }















    if (types == 'set_time_out') {







      for (let i = 0; i < 4; i++) { 
        console.log("first i = ", i)
        setTimeout(() => {
          console.log(i)
        }, i * 1000)

        console.log("after set timeout i = ", i)
      }





      for (var i = 0; i < 4; i++) { 
        console.log("first i = ", i)
        setTimeout(() => {
          console.log(i)
        }, i * 1000)

        console.log("after set timeout i = ", i)
      }

    }



    if (types == 'promise') {

      let arr = [1, 2, 3, 4, 5, 5, 4, 4, 3, 3, 2, 2, 2, 4, 6, 7, 87, 6, 7, 8, 8, 9, 5, 3, 3, 2, 7, 6, 5, 4, 3, 2, 2, 2, 2, 4, 6, 7, 8, 2, 9, 6, 5, 4, 3]

      let newSet = arr.map((value) => { 
        return value
      })

      let newValues = await Promise.all(newSet).then((values) => {
        return values
      });
      console.log("newValues-->>>>>", newValues)

    }

    let response = {
      statusCode: 200,
      message: "success response",
      data: data,
      arr: array
    }

    res.json(response);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};


// for (var i = 0; i < 4; i++) {
//   setTimeout(() => {
//     console.log(i)
//   }, i * 1000)



//   const myArray: any = ["zero", "one", "two"];
//   myArray.myMethod = function (sProperty: any) {
//     console.log(arguments.length > 0 ? this[sProperty] : this);
//   };

//   setTimeout(myArray.myMethod, 1.0 * 1000);
//   setTimeout(myArray.myMethod, 1.5 * 1000, "1");

// }


// let x = 5;
// {
//   let x = 8
//   console.log(x);
// }
