import React, { Component } from "react";
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom';
import defaultProfile from '../assets/defaultProfile.png'

//components
import Post from '../components/post/Post.js';

//MUI stuff
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Grid, IconButton, Icon } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

//redux
import { connect } from 'react-redux';
import { loadInspectedUserDetails } from '../redux/actions/dataActions';

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
    progress: {
        position: 'absolute'
    },
    button: {
        position: 'relative',
        marginTop: 10
    },
    followersBtn: {
        padding: '10px',
        position: 'relative',
        display: 'block'
    },
    followingBtn: {
        padding: '10px',
        position: 'relative',
        display: 'block'
    }
});

class InspectOtherProfile extends Component {
    render() {
        const { classes, data: { inspectedUserDetails, inspectedUserPosts, loadingInspectedUserPosts, loadingInspectedUser }, user: { loading, authenticated } } = this.props;

        let inspectedUserProfile = !loadingInspectedUser ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={`data:image/jpeg;base64,${inspectedUserDetails.profilePicture}`} alt="profile" className="profile-image"></img>
                    
                        <Button size="medium" className={classes.followersBtn}>
                            {inspectedUserDetails.followerCount+' followers'}
                        </Button>

                        <Button size="medium" className={classes.followingBtn}>
                            {inspectedUserDetails.followingCount+' following'}
                        </Button>
                    </div>

                    <hr></hr>

                    <div className="profile-details">
                        <MuiLink component={Link} to={`/profile/${inspectedUserDetails.idUser}`} color="primary" variant="h5">
                            @{inspectedUserDetails.username}
                        </MuiLink>

                        <hr></hr>

                        {inspectedUserDetails.firstName && <Typography variant="body2" color="primary">{inspectedUserDetails.firstName + " " + inspectedUserDetails.lastName}</Typography>}

                        <hr></hr>

                        {inspectedUserDetails.profileDescription && <Typography variant="body2" >{inspectedUserDetails.profileDescription}</Typography>}

                    </div>
                </div>
            </Paper>
        ) : (
                <Paper className={classes.paper}>
                    <div className={classes.profile}>
                        <div className="image-wrapper">
                            <img src={defaultProfile} className="profile-image"></img>
                        </div>

                        <hr></hr>

                        <div className="profile-details">
                            <MuiLink component={Link} to={`/profile/${this.props.match.params}`} color="primary" variant="h5">
                                @Loading...
                            </MuiLink>
                        </div>
                    </div>
                </Paper>
            )
        
        let inspectUserPosts = !loadingInspectedUserPosts && inspectedUserPosts ? (
            inspectedUserPosts.map(post => <Post post={post}></Post>)
        ) :(<p>Loading posts...</p>)

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {inspectedUserProfile}
                </Grid>

                <Grid item xs={8}>
                    {inspectUserPosts}
                </Grid>
            </Grid>
        )
    };
}

const mapStateToProps = (state) => ({
    data: state.data,
    user: state.data
})

const mapActionsToPros = {
    loadInspectedUserDetails
};

InspectOtherProfile.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    loadInspectedUserDetails: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapActionsToPros)(withStyles(styles)(InspectOtherProfile));