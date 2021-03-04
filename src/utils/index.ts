const isRealString = (str: any) => {
    return typeof str === 'string' && str.trim().length > 0;
};

export { isRealString };
