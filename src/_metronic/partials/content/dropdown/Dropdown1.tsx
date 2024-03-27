import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from 'app/redux/hooks';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Conversation } from '_metronic/layout/components/aside/Tabs/tabTypes';
import { getAllConversationsThunk } from 'app/redux/thunks/conversationThunk';
import { addConversationChunk, clearConversationContent, setFilteredConversations, setSearchDateFilter } from 'app/redux/features/conversation-slice';
import { DateType } from '_metronic/partials/layout/search/dateType';


export function Dropdown1() {
  const dispatch = useAppDispatch();
  const _conversationContents = useAppSelector(state => state.conversation.conversations)
  const _filteredConversations = useAppSelector(state => state.conversation.filteredConversations)
  const _searchDateFilter = useAppSelector(state => state.conversation.searchDateFilter);
  const [applyFilter, setApplyFilter] = useState<boolean>(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const fetchAllConversationsData: () => Promise<Conversation[]> = async () => {
    try {
      const all_conversations = ((await dispatch(getAllConversationsThunk("cal"))).payload) as Conversation[];
      return all_conversations;
    } catch (error) {
      // Handle errors if needed
      console.error("Error fetching conversations:", error);
      return [];
    }
  }

  useEffect(() => {
    const fetchDataAndFilter = async () => {
      if (applyFilter) {
        // Reset applyFilter state
        setApplyFilter(false);

        // localStorage.setItem("searchDateFilter", JSON.stringify(searchDateFilter));
        dispatch(setSearchDateFilter(
          {
            searchDateFilter: _searchDateFilter
          }
        ))

        try {
          // Fetch all conversations data
          const latest_all_conversations = await fetchAllConversationsData();

          let filteredConversations: Conversation[] = [];

          if (_searchDateFilter) {
            if (_searchDateFilter instanceof Date) {
              // If searchDateFilter is a single Date
              filteredConversations = latest_all_conversations.filter(conversation => {
                const conversationDate = new Date(conversation.updated_at);
                return conversationDate >= _searchDateFilter;
              });
            } else if (
              Array.isArray(_searchDateFilter) &&
              _searchDateFilter.length === 2 &&
              _searchDateFilter[0] &&
              _searchDateFilter[1]
            ) {
              // If searchDateFilter is an array of [DatePiece, DatePiece]
              filteredConversations = latest_all_conversations.filter(conversation => {
                const conversationDate = new Date(conversation.updated_at);
                return (
                  _searchDateFilter[0] &&
                  _searchDateFilter[1] &&
                  conversationDate >= new Date(_searchDateFilter[0]) &&
                  conversationDate <= new Date(_searchDateFilter[1])
                );
              });
            }
          }

          dispatch(setFilteredConversations(filteredConversations));

          // First Clear the conversation contents
          dispatch(clearConversationContent());

          filteredConversations.forEach((conversation: Conversation) => {
            dispatch(addConversationChunk({
              conversation: conversation
            }));
          });

        } catch (error) {
          // Handle errors if needed
          console.error("Error fetching and filtering conversations:", error);
        }
      };
    };

    fetchDataAndFilter();
  }, [_searchDateFilter, applyFilter]);

  const resetDateRangePicker = () => {
    dispatch(setSearchDateFilter({
      searchDateFilter: [new Date(), new Date()] as DateType
    }));
  }

  const submitDateRangePickerFilter = () => {
    setApplyFilter(true);

    let start_date = new Date(_searchDateFilter[0]).toLocaleDateString();
    let end_date = new Date(_searchDateFilter[1]).toLocaleDateString();
    enqueueSnackbar(`Conversations Filtered from ${start_date} to ${end_date}`, {
      variant: 'default',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      autoHideDuration: 3000
    });
  };

  return (
    <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px' data-kt-menu='true'>
      <div className='px-7 py-5'>
        <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
      </div>

      <div className='separator border-gray-200'></div>

      <div className='px-7 py-5'>
        {/* <div className='mb-10'>
          <label className='form-label fw-bold'>Status:</label>

          <div>
            <select
              className='form-select form-select-solid'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              defaultValue={'1'}
            >
              <option></option>
              <option value='1'>Approved</option>
              <option value='2'>Pending</option>
              <option value='3'>In Process</option>
              <option value='4'>Rejected</option>
            </select>
          </div>
        </div>

        <div className='mb-10'>
          <label className='form-label fw-bold'>Member Type:</label>

          <div className='d-flex'>
            <label className='form-check form-check-sm form-check-custom form-check-solid me-5'>
              <input className='form-check-input' type='checkbox' value='1' />
              <span className='form-check-label'>Author</span>
            </label>

            <label className='form-check form-check-sm form-check-custom form-check-solid'>
              <input className='form-check-input' type='checkbox' value='2' defaultChecked={true} />
              <span className='form-check-label'>Customer</span>
            </label>
          </div>
        </div>

        <div className='mb-10'>
          <label className='form-label fw-bold'>Notifications:</label>

          <div className='form-check form-switch form-switch-sm form-check-custom form-check-solid'>
            <input
              className='form-check-input'
              type='checkbox'
              value=''
              name='notifications'
              defaultChecked={true}
            />
            <label className='form-check-label'>Enabled</label>
          </div>
        </div> */}

        <div className='mb-10'>
          <DateRangePicker
            className='form-control'
            value={_searchDateFilter}
            onChange={(e) => {
              dispatch(setSearchDateFilter({
                searchDateFilter: e
              }))
            }}
          />
        </div>

        <div className='d-flex justify-content-end'>
          <button
            type='reset'
            className='btn btn-sm btn-light btn-active-light-primary me-2'
            data-kt-menu-dismiss='true'
            onClick={resetDateRangePicker}
          >
            Reset
          </button>

          <button type='submit' className='btn btn-sm btn-primary' data-kt-menu-dismiss='true'
            onClick={submitDateRangePickerFilter}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
