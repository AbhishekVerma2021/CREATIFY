import Sidebar from "./Sidebar";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "./props";
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);