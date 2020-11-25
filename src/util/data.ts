import fs from 'fs';
import { dataPath } from './path';
import { IProduct } from '../models/product';

export type Callback = (products: IProduct[]) => void;

export const retrieveData = (callback: Callback): void => {
	fs.readFile(dataPath, (err, fileContent) => {
		if (err) {
			return callback([]);
		} else {
			callback(JSON.parse(fileContent.toString()));
		}
	});
};

export const saveData = (instance: IProduct): void => {
    
    const findAndReplace = (arr: IProduct[], item: IProduct) => {
		const idx = arr.findIndex((i) => i.id === item.id);
        if (idx!==-1){
            arr[idx] = item;
        } else {
            arr.push(item);
        }
        return idx;
	};

	retrieveData((products) => {
		if (!instance.image) {
			instance.image =
				'https://image.freepik.com/free-psd/paper-coffee-bags-mockup_58466-11166.jpg';
		}
        
		findAndReplace(products, instance);
		
		fs.writeFile(dataPath, JSON.stringify(products), (err) => {
			console.log(err);
		});
	});
};

export const fetchProduct = (
	cb: (product: IProduct | undefined) => void,
	productId: string
): void => {
	//retrieveData callback: execute after finish retrieve data
	const callback = (products: IProduct[]) => {
		const product = products.find((product) => product.id === productId);
		//fetchProduct callback: execute after find product in the retrieve data
		//this callback will do something with the lookup product (eg. execute req.render)
		cb(product);
	};
	retrieveData(callback);
};

export const fetchAll = (callback: Callback): void => {
	retrieveData(callback);
};
