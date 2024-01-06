import UserChatView from './UserChatView';
import { connect } from 'react-redux';
import {
  mapStateToProps,
  mapDispatchToProps,
} from './props';
export default connect(mapStateToProps, mapDispatchToProps)(UserChatView);