export const pagination = ({
    page = 1,
    size = 2,
}) =>{
    if(page < 1) page = 1;
    if(size < 1) size = 2;

    const limit = parseInt(size);
    const skip = (+page - 1) * size;

    return {limit, skip};
};