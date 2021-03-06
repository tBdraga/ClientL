import React, { Component } from "react";
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom';
import Axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import defaultProfile from '../assets/defaultProfile.png'

//components
import Post from '../components/post/Post.js';
import EditDetails from '../components/edit profile details/EditDetails';

//CSS
import './EditProfile.css';

//MUI stuff
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Grid, IconButton, Icon } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';

//icons
import EditIcon from '@material-ui/icons/Edit';

//redux
import { connect } from 'react-redux';
import {changeProfilePicture} from '../redux/actions/userActions';

const styles = (theme) => ({
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAllign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        '& .profile-details': {
            textAllign: 'center',
            '& span, svg': {
                verticalAllign: 'middle'
            },
            '& a': {
                color: theme.palette.primary.main
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        },
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    buttons: {
        textAllign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    }
});

class EditProfile extends Component {
    state = {
        posts: [],
        startPosition: 0,
        step: 3,
        hasMore: true,
    }

    /*componentWillReceiveProps(nextProps) {

        if (nextProps.user) {
            this.fetchInitialPosts(nextProps.user);
        }
    }*/

    componentDidMount(){
        const {user} = this.props;

        if(user){
            this.fetchInitialPosts(user)
        }
    }

    fetchInitialPosts(userProps) {
        let startPosition = this.state.startPosition;
        let step = this.state.step;

        let url = '/users/getPersonalPostsPaginated/' + userProps.idUser;

        //get initial Posts
        Axios.post(url, null, {
            params: {
                startPosition: startPosition,
                step: step
            }
        })
            .then((res) => {
                let posts = res.data

                this.setState({
                    posts: posts,
                });
            })
            .catch(err => console.log(err));
    }

    fetchNextPosts = () => {
        let step = this.state.step;
        let currentStartPosition = this.state.startPosition;

        let newStartPosition = currentStartPosition + step;

        let url;

        if (this.props.user.idUser)
            url = '/users/getPersonalPostsPaginated/' + this.props.user.idUser;

        if (url) {
            //get new Posts
            Axios.post(url, null, {
                params: {
                    startPosition: newStartPosition,
                    step: step
                }
            })
                .then((res, miau) => {
                    let posts = res.data

                    if (posts) {
                        this.setState({
                            //append new Posts
                            posts: this.state.posts.concat(posts),
                            startPosition: newStartPosition
                        });
                    } else {
                        this.setState({
                            hasMore: false
                        });

                        return;
                    }
                })
                .catch(err => console.log(err));
        }
    }

    handleImageChange = (event) => {
        const image = event.target.files[0];
        const profilePicture = new FormData();

        profilePicture.append('profilePicture', image, image.name);

        this.props.changeProfilePicture(profilePicture, this.props.user.idUser);
    }

    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');

        fileInput.click();
    }

    render() {

        const { classes, user: { username, firstName, lastName, idUser, profileDescription, profilePicture, loading, authenticated } } = this.props;

        const profileImage = !profilePicture ? (
            <img src={defaultProfile} className="profile-image"></img>
        ) : (
            <img src={`data:image/jpeg;base64,${profilePicture}`} alt="profile" className="profile-image"></img>
        )

        let personalPostsMarkup = this.state.posts ? (
            this.state.posts.map(post => <Post post={post}></Post>)
        ) : <p>No posts available :(</p>

        let profileMarkup = !loading ? (authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        {profileImage}

                        <input type="file" id="imageInput" onChange={this.handleImageChange} hidden="hidden"></input>

                        <Tooltip title="Change Picture" placement="top">
                            <IconButton onClick={this.handleEditPicture} className="button">
                                <EditIcon color="primary"></EditIcon>
                            </IconButton>
                        </Tooltip>
                    </div>

                    <hr></hr>

                    <div className="profile-details">
                        <MuiLink component={Link} to={`/users/${idUser}`} color="primary" variant="h5">
                            @{username}
                        </MuiLink>

                        <hr></hr>

                        {firstName && <Typography variant="body2" color="primary">{firstName + " " + lastName}</Typography>}

                        <hr></hr>

                        {profileDescription && <Typography variant="body2" >{profileDescription}</Typography>}

                        <EditDetails></EditDetails>

                    </div>
                </div>
            </Paper>
        ) : (
                <Paper className={classes.paper}>
                    <Typography variant="body2" align="center">Missing profile...</Typography>
                    <div className={classes.buttons}>
                        <Button variant="contained" color="primary" component={Link} to="/login">Login</Button>
                        <Button variant="contained" color="secondary" component={Link} to="/signup">Signup</Button>
                    </div>
                </Paper>
            )) : (<p>loading...</p>)

        return (
            <Grid container spacing={3}>
                <Grid item sx={12}>
                    {profileMarkup}
                </Grid>

                <Grid item sx={12}>
                    <InfiniteScroll dataLength={this.state.posts.length} next={this.fetchNextPosts} hasMore={this.state.hasMore} loader={<h4>Loading ...</h4>} endMessage={<p><b>No more posts :(</b></p>}>
                        {personalPostsMarkup}
                    </InfiniteScroll>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToPros = {changeProfilePicture};

EditProfile.propTypes = {
    changeProfilePicture: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapActionsToPros)(withStyles(styles)(EditProfile));