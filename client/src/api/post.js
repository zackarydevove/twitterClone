import axios from "axios";


const API_URL = 'http://localhost:5000/api/post';

export const postTweet = (content) => {
    return axios({
        method: 'POST',
        data: {
            type: 'Post',
            content: content,
        },
        withCredentials: true,
        url: `${API_URL}/post`
    })
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err);
        return null
    });
};

export const getPost = (postId) => {
    return axios({
        method: 'POST',
        data: {
          postId: postId,
        },
        withCredentials: true,
        url: `${API_URL}/get`
      })
      .then((res) => {
        return (res.data);
      })
      .catch((err) => {
        console.log(err);
        return null
      })
}

export const likeTweet = (postId) => {
    return axios({
        method: 'POST',
        data: {
            postId: postId,
        },
        withCredentials: true,
        url: `${API_URL}/like`
    }).then((res) => {
        return (res.data)
    })
    .catch((err) => {
        console.log(err);
        return null
    })
}

export const deleteTweet = (postId) => {
    console.log('dans la fonction deleteTweet, jai cette id', postId)
    return axios({
        method: 'DELETE',
        withCredentials: true,
        url: `${API_URL}/delete/${postId}`
    }).then((res) => {
        return (res.data);
    })
    .catch((err) => {
        console.log(err); 
        return null
    })
}

export const replyTweet = (postId, replyContent) => {
    return axios({
        method: 'POST',
        data: {
            replyContent: replyContent,
            postId: postId,
        },
        withCredentials: true,
        url: `${API_URL}/reply`
    })
    .then((res) => {
        console.log('Reply sent');
        return (res.data);
    })
    .catch((err) => {
        console.log(err);
        return null
    })
};

export const retweet = (postId) => {
    return axios({
        method: 'POST',
        data: {
            postId: postId,
        },
        withCredentials: true,
        url: `${API_URL}/retweet`
    })
    .then((res) => {
        console.log('Retweet successful');
        return (res.data);
    })
    .catch((err) => {
        console.log(err);
        return null;
    })
}

export const bookmark = (postId) => {
    return axios({
        method: 'POST',
        data: {
            postId: postId,
        },
        withCredentials: true,
        url: `${API_URL}/bookmark`
    })
    .then((res) => {
        console.log('Bookmark successful');
        return (res.data);
    })
    .catch((err) => {
        console.log(err);
        return null
    })
}