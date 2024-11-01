import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import fetchUsersPosts from "../query/fetchusersposts";
import "./user.css";

import Header from "../header";
import Post from "../post/post";

const User = () => {

    const userjwt = Cookies.get('userjwt');
    const { userid } = useParams();

    const [posts, setPosts] = useState([]);
    const [depleted, setDepleted] = useState(false);

    useEffect(() => {
        // Scroll to top on component mount
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        // Load initial posts if not depleted
        if (!depleted) {
            requestPosts(posts);
        }

        // Scroll handler for loading more posts
        const handleScroll = () => {
            if (!depleted && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                requestPosts(posts);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up scroll event listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, [posts, depleted, userid]);

    async function requestPosts(currentPosts) {
    try {
        const new_posts = await fetchUsersPosts(userid, userjwt, currentPosts);
        console.log("requestPosts new_posts:", new_posts);

        if (new_posts.allPostsDepleted) {
            console.log('All posts depleted');
            setDepleted(true);
            return;
        }

        setPosts((prevPosts) => [...prevPosts, ...new_posts.postids]);
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

    return (
        <div id="main">
            <Header />
            <div className="userHeader">
                <div>
                    <section>tło</section>
                    <section>
                        <div className="profilePicture">
                            <img src="" alt="profile picture" />
                        </div>
                        <div className="stats">
                            <h1>imie nazwisko</h1>
                            <p>x znajomi • x wspólni znajomi</p>
                        </div>
                        <div className="">znajomi button</div>
                    </section>
                </div>
            </div>
            <div className="userbody">
                <section>
                    <h1>id = {userid}</h1>
                </section>
                <section>
                    <div>
                        informacje
                        zdjecia
                        znajomi
                    </div>
                    <div id="userposts" className="userposts">
                        {posts.map((id) => (
                            <Post key={id} id={id} />
                        ))}
                    </div>               
                </section>
            </div>
        </div>
    );
}

export default User;
