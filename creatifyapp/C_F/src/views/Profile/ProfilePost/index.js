import ProfilePost from "./ProfilePost";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "./props";

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePost);