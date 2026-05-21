const words = [
    'apple', 'banana', 'house', 'car', 'tree',
    'dog', 'cat', 'sun', 'moon', 'star',
    'fish', 'bird', 'flower', 'book', 'phone',
    'guitar', 'piano', 'chair', 'table', 'lamp',
    'clock', 'train', 'boat', 'bicycle', 'umbrella',
    'pizza', 'burger', 'cake', 'ice cream', 'cookie',
    'rocket', 'airplane', 'helicopter', 'mountain', 'river',
    'beach', 'island', 'forest', 'desert', 'volcano',
    'rainbow', 'cloud', 'lightning', 'snowman', 'fire',
    'crown', 'sword', 'shield', 'castle', 'dragon',
    'robot', 'alien', 'ghost', 'wizard', 'ninja',
    'camera', 'television', 'computer', 'keyboard', 'mouse',
    'football', 'basketball', 'tennis', 'swimming', 'bowling',
    'elephant', 'giraffe', 'penguin', 'dolphin', 'butterfly',
    'glasses', 'hat', 'shoe', 'backpack', 'watch'
];

const getRandomWord = () => {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
};

module.exports = getRandomWord;
