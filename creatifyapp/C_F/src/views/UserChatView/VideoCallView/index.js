import VideoCallView from "./VideoCallView";
import { connect } from 'react-redux';
import {
  mapStateToProps,
  mapDispatchToProps,
} from './props';
export default connect(mapStateToProps, mapDispatchToProps)(VideoCallView);
