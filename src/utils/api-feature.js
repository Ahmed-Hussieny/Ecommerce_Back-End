import { pagination } from "./pagination.js";

export class APIFeatures {
    constructor(query, mongooseQuery) {
        this.query = query;
        this.mongooseQuery = mongooseQuery;
    }

    pagination({ page, size }) {
        const {limit, skip} = pagination({page, size});
        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);
        return this;
    }

    sort(sortBy){
        if(!sortBy) {
            this.mongooseQuery = this.mongooseQuery.sort({createdAt: -1});
            return this;
        }
        const formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':');
        const [key, value] = formula.split(':');
        this.mongooseQuery = this.mongooseQuery.sort({[key]: +value});
        return this;
    }
    search(search){
        const queryFilter = {};
        if(search.name) queryFilter.name = { $regex: search.name, $options: 'i' }
        if(search.title) queryFilter.title = { $regex: search.title, $options: 'i' }; // i for case-insensitive
        if(search.desc) queryFilter.desc = { $regex: search.desc, $options: 'i' };
        if(search.disCount) queryFilter.disCount = {$ne: search.disCount};
        if(search.priceFrom && !search.priceTo) queryFilter.appliedPrice = { $gte: search.priceFrom};
        if(search.priceTo && !search.priceFrom) queryFilter.appliedPrice = { $lte: search.priceTo};
        if(search.priceFrom && search.priceTo) queryFilter.appliedPrice = { $gte: search.priceFrom, $lte: search.priceTo};
        this.mongooseQuery = this.mongooseQuery.find(queryFilter);
        return this;
    }
};