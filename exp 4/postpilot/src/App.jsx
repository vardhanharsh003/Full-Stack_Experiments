import React, {
  useState,
  useMemo,
  useCallback,
  useRef
} from "react";

import "./App.css";


/* =====================================================
   INITIAL POSTS
===================================================== */

const initialPosts = [
  {
    id: 1,
    title: "College Fest Announcement",
    date: "2026-09-04",
    time: "10:00",
    platform: "Instagram"
  },
  {
    id: 2,
    title: "New Product Launch",
    date: "2026-09-09",
    time: "14:00",
    platform: "LinkedIn"
  },
  {
    id: 3,
    title: "Weekend Campaign",
    date: "2026-09-15",
    time: "18:00",
    platform: "Facebook"
  },
  {
    id: 4,
    title: "Student Achievement",
    date: "2026-09-21",
    time: "12:00",
    platform: "Instagram"
  }
];


/* =====================================================
   PLATFORM ICON
===================================================== */

function getPlatformIcon(platform) {
  if (platform === "Instagram") return "◎";
  if (platform === "Facebook") return "f";
  if (platform === "LinkedIn") return "in";

  return "●";
}


/* =====================================================
   POST COMPONENT
   React.memo is used for optimization
===================================================== */

const CalendarPost = React.memo(function CalendarPost({
  post,
  onEdit,
  onDragStart
}) {
  return (
    <div
      className={
        "event " +
        post.platform.toLowerCase()
      }

      draggable="true"

      onDragStart={(event) => {
        onDragStart(event, post);
      }}

      onClick={() => onEdit(post)}

      title={
        "Drag this post to another date: " +
        post.title
      }
    >
      <span className="event-symbol">
        {getPlatformIcon(post.platform)}
      </span>

      <span className="event-title">
        {post.title}
      </span>
    </div>
  );
});


/* =====================================================
   POST LIST COMPONENT
===================================================== */

const PostList = React.memo(function PostList({
  posts,
  onEdit,
  onDelete
}) {
  return (
    <div className="post-list">

      {posts.length === 0 ? (

        <p className="no-posts">
          No posts found.
        </p>

      ) : (

        posts.map((post) => (

          <div
            className="post-item"
            key={post.id}
          >

            <div
              className={
                "platform " +
                post.platform.toLowerCase()
              }
            >
              {getPlatformIcon(post.platform)}
            </div>


            <div className="post-details">

              <strong>
                {post.title}
              </strong>

              <span>
                {post.platform} •{" "}
                {post.date} •{" "}
                {post.time}
              </span>

            </div>


            <button
              className="edit"
              onClick={() => onEdit(post)}
              title="Edit post"
            >
              ✎
            </button>


            <button
              className="delete"
              onClick={() => onDelete(post.id)}
              title="Delete post"
            >
              ×
            </button>

          </div>

        ))

      )}

    </div>
  );
});


/* =====================================================
   APP
===================================================== */

function App() {

  /* ===================================================
     STATES
  =================================================== */

  const [posts, setPosts] = useState(
    initialPosts
  );

  const [month, setMonth] = useState(8);

  const [year, setYear] = useState(2026);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [optimized, setOptimized] =
    useState(true);


  /* ===================================================
     RENDERING COUNTERS
  =================================================== */

  const calendarRenderCount =
    useRef(0);

  const postListRenderCount =
    useRef(0);

  const eventCalculationCount =
    useRef(0);

  const actionCount =
    useRef(0);


  calendarRenderCount.current++;

  postListRenderCount.current++;


  /* ===================================================
     FORM
  =================================================== */

  const [form, setForm] = useState({
    title: "",
    date: "2026-09-01",
    time: "10:00",
    platform: "Instagram"
  });


  /* ===================================================
     MONTH NAMES
  =================================================== */

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];


  /* ===================================================
     CALENDAR INFORMATION
  =================================================== */

  const daysInMonth = useMemo(() => {

    return new Date(
      year,
      month + 1,
      0
    ).getDate();

  }, [year, month]);


  const firstDay = useMemo(() => {

    return new Date(
      year,
      month,
      1
    ).getDay();

  }, [year, month]);


  /* ===================================================
     FILTER POSTS
     useMemo = optimization
  =================================================== */

  const filteredPosts = useMemo(() => {

    eventCalculationCount.current++;

    return posts.filter((post) => {

      const searchMatch =
        post.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const filterMatch =
        filter === "All" ||
        post.platform === filter;

      return (
        searchMatch &&
        filterMatch
      );

    });

  }, [posts, search, filter]);


  /* ===================================================
     PREPARE POSTS BY DATE
     This avoids repeatedly filtering the complete
     post array for every calendar date.
  =================================================== */

  const postsByDate = useMemo(() => {

    eventCalculationCount.current++;

    const grouped = {};

    filteredPosts.forEach((post) => {

      if (!grouped[post.date]) {
        grouped[post.date] = [];
      }

      grouped[post.date].push(post);

    });

    return grouped;

  }, [filteredPosts]);


  /* ===================================================
     PREVIOUS MONTH
  =================================================== */

  const previousMonth = useCallback(() => {

    actionCount.current++;

    if (month === 0) {

      setMonth(11);
      setYear((currentYear) =>
        currentYear - 1
      );

    } else {

      setMonth((currentMonth) =>
        currentMonth - 1
      );

    }

  }, [month]);


  /* ===================================================
     NEXT MONTH
  =================================================== */

  const nextMonth = useCallback(() => {

    actionCount.current++;

    if (month === 11) {

      setMonth(0);
      setYear((currentYear) =>
        currentYear + 1
      );

    } else {

      setMonth((currentMonth) =>
        currentMonth + 1
      );

    }

  }, [month]);


  /* ===================================================
     TODAY
  =================================================== */

  const goToday = useCallback(() => {

    actionCount.current++;

    setMonth(8);
    setYear(2026);

  }, []);


  /* ===================================================
     OPEN CREATE MODAL
  =================================================== */

  const openCreateModal = useCallback(() => {

    actionCount.current++;

    setEditId(null);

    setForm({
      title: "",

      date:
        `${year}-${String(
          month + 1
        ).padStart(2, "0")}-01`,

      time: "10:00",

      platform: "Instagram"
    });

    setShowModal(true);

  }, [year, month]);


  /* ===================================================
     OPEN EDIT MODAL
  =================================================== */

  const openEditModal = useCallback((post) => {

    actionCount.current++;

    setEditId(post.id);

    setForm({
      title: post.title,
      date: post.date,
      time: post.time,
      platform: post.platform
    });

    setShowModal(true);

  }, []);


  /* ===================================================
     SAVE POST
  =================================================== */

  function savePost(event) {

    event.preventDefault();

    if (!form.title.trim()) {

      alert(
        "Please enter a post title."
      );

      return;
    }


    actionCount.current++;


    if (editId) {

      setPosts((currentPosts) =>

        currentPosts.map((post) =>

          post.id === editId
            ? {
                ...post,
                ...form
              }
            : post

        )

      );

    } else {

      setPosts((currentPosts) => [

        ...currentPosts,

        {
          id: Date.now(),
          ...form
        }

      ]);

    }


    setShowModal(false);

  }


  /* ===================================================
     DELETE POST
  =================================================== */

  const deletePost = useCallback((id) => {

    const answer = window.confirm(
      "Do you want to delete this post?"
    );

    if (!answer) return;


    actionCount.current++;


    setPosts((currentPosts) =>
      currentPosts.filter(
        (post) => post.id !== id
      )
    );

  }, []);


  /* ===================================================
     DRAG START
  =================================================== */

  const handleDragStart = useCallback(
    (event, post) => {

      event.dataTransfer.setData(
        "postId",
        String(post.id)
      );

      event.dataTransfer.effectAllowed =
        "move";

    },
    []
  );


  /* ===================================================
     DROP POST
  =================================================== */

  const handleDrop = useCallback(
    (event, newDate) => {

      event.preventDefault();


      const postId =
        Number(
          event.dataTransfer.getData(
            "postId"
          )
        );


      if (!postId) return;


      actionCount.current++;


      setPosts((currentPosts) =>

        currentPosts.map((post) =>

          post.id === postId
            ? {
                ...post,
                date: newDate
              }
            : post

        )

      );

    },
    []
  );


  /* ===================================================
     ALLOW DROP
  =================================================== */

  const handleDragOver = useCallback(
    (event) => {

      event.preventDefault();

      event.dataTransfer.dropEffect =
        "move";

    },
    []
  );


  /* ===================================================
     BUILD CALENDAR
  =================================================== */

  const calendar = useMemo(() => {

    const result = [];


    /* EMPTY DAYS */

    for (
      let i = 0;
      i < firstDay;
      i++
    ) {

      result.push(

        <div
          className="calendar-empty"
          key={"empty-" + i}
        />

      );

    }


    /* ACTUAL DAYS */

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {

      const date =
        `${year}-${String(
          month + 1
        ).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;


      const dayPosts =
        postsByDate[date] || [];


      const today =
        date === "2026-09-01";


      result.push(

        <div

          className={
            today
              ? "calendar-day today"
              : "calendar-day"
          }

          key={date}

          onDragOver={
            handleDragOver
          }

          onDrop={(event) =>
            handleDrop(
              event,
              date
            )
          }

        >

          <div className="day-number">
            {day}
          </div>


          <div className="drop-hint">
            {dayPosts.length === 0
              ? "Drop post here"
              : ""}
          </div>


          {dayPosts.map((post) => (

            <CalendarPost

              key={post.id}

              post={post}

              onEdit={
                openEditModal
              }

              onDragStart={
                handleDragStart
              }

            />

          ))}

        </div>

      );

    }


    return result;

  }, [
    firstDay,
    daysInMonth,
    year,
    month,
    postsByDate,
    handleDragOver,
    handleDrop,
    openEditModal,
    handleDragStart
  ]);


  /* ===================================================
     RESET PERFORMANCE COUNTERS
  =================================================== */

  function resetCounters() {

    calendarRenderCount.current = 0;

    postListRenderCount.current = 0;

    eventCalculationCount.current = 0;

    actionCount.current = 0;

    setOptimized(true);

  }


  /* ===================================================
     RENDER
  =================================================== */

  return (

    <div className="app">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-box">
            ✦
          </div>

          <div>

            <h2>
              PLANLY
            </h2>

            <p>
              Content Studio
            </p>

          </div>

        </div>


        <div className="menu">

          <button className="menu-item active">
            <span>⌂</span>
            Dashboard
          </button>

          <button className="menu-item">
            <span>▦</span>
            Calendar
          </button>

          <button className="menu-item">
            <span>▤</span>
            My Posts
          </button>

          <button className="menu-item">
            <span>◒</span>
            Analytics
          </button>

        </div>


        <div className="bottom-menu">

          <button className="menu-item">
            <span>⚙</span>
            Settings
          </button>

          <button className="menu-item">
            <span>?</span>
            Help
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main">


        {/* HEADER */}

        <header className="header">

          <div>

            <p className="small-title">
              CONTENT WORKSPACE
            </p>

            <h1>
              Plan your{" "}
              <span>
                big ideas.
              </span>
            </h1>

            <p className="subtitle">
              Schedule, organize and
              optimize your social media
              content.
            </p>

          </div>


          <button
            className="create-button"
            onClick={
              openCreateModal
            }
          >
            + New Post
          </button>

        </header>


        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              ▦
            </div>

            <div>

              <p>
                Scheduled Posts
              </p>

              <h3>
                {posts.length}
              </h3>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange">
              ◷
            </div>

            <div>

              <p>
                Calendar Days
              </p>

              <h3>
                {daysInMonth}
              </h3>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>

              <p>
                Platforms
              </p>

              <h3>
                3
              </h3>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon pink">
              ⚡
            </div>

            <div>

              <p>
                Optimization
              </p>

              <h3>
                {optimized
                  ? "ON"
                  : "OFF"}
              </h3>

            </div>

          </div>

        </section>


        {/* =================================================
            SEARCH AND FILTER
        ================================================= */}

        <section className="tools">

          <div className="search">

            🔍

            <input
              type="text"
              placeholder="Search your posts..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          <div className="filter">

            ☷

            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value
                )
              }
            >

              <option value="All">
                All Platforms
              </option>

              <option value="Instagram">
                Instagram
              </option>

              <option value="Facebook">
                Facebook
              </option>

              <option value="LinkedIn">
                LinkedIn
              </option>

            </select>

          </div>

        </section>


        {/* =================================================
            CALENDAR
        ================================================= */}

        <section className="calendar-card">


          <div className="calendar-top">

            <div>

              <p className="small-title">
                DRAG & DROP CALENDAR
              </p>

              <h2>
                {monthNames[month]}{" "}
                {year}
              </h2>

            </div>


            <div className="calendar-buttons">

              <button
                onClick={
                  previousMonth
                }
              >
                ←
              </button>

              <button
                onClick={goToday}
              >
                Today
              </button>

              <button
                onClick={
                  nextMonth
                }
              >
                →
              </button>

            </div>

          </div>


          <div className="drag-info">

            <span>
              ↔
            </span>

            Drag a post and drop it
            onto another date to
            reschedule it.

          </div>


          <div className="weekdays">

            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>

          </div>


          <div className="calendar">

            {calendar}

          </div>

        </section>


        {/* =================================================
            LOWER SECTION
        ================================================= */}

        <section className="lower">


          {/* POSTS */}

          <div className="posts-card">

            <div className="card-heading">

              <div>

                <p className="small-title">
                  CONTENT QUEUE
                </p>

                <h2>
                  Upcoming Posts
                </h2>

              </div>

              <span className="heading-icon">
                ✦
              </span>

            </div>


            <PostList

              posts={
                filteredPosts
              }

              onEdit={
                openEditModal
              }

              onDelete={
                deletePost
              }

            />

          </div>


          {/* =================================================
              PERFORMANCE MONITOR
          ================================================= */}

          <div className="optimization">

            <div className="optimization-header">

              <div className="bolt">
                ⚡
              </div>

              <div>

                <p className="small-title">
                  PERFORMANCE MONITOR
                </p>

                <h2>
                  React Rendering
                </h2>

              </div>

            </div>


            {/* OPTIMIZATION SWITCH */}

            <div className="optimization-buttons">

              <button

                className={
                  optimized
                    ? "selected"
                    : ""
                }

                onClick={() =>
                  setOptimized(true)
                }

              >
                Optimized
              </button>


              <button

                className={
                  !optimized
                    ? "selected"
                    : ""
                }

                onClick={() =>
                  setOptimized(false)
                }

              >
                Standard

              </button>

            </div>


            {/* OPTIMIZATION METHODS */}

            <div className="optimization-list">

              <div>

                <span>
                  React.memo
                </span>

                <b
                  className={
                    optimized
                      ? "active"
                      : "inactive"
                  }
                >
                  {optimized
                    ? "ACTIVE"
                    : "OFF"}
                </b>

              </div>


              <div>

                <span>
                  useMemo
                </span>

                <b
                  className={
                    optimized
                      ? "active"
                      : "inactive"
                  }
                >
                  {optimized
                    ? "ACTIVE"
                    : "OFF"}
                </b>

              </div>


              <div>

                <span>
                  useCallback
                </span>

                <b
                  className={
                    optimized
                      ? "active"
                      : "inactive"
                  }
                >
                  {optimized
                    ? "ACTIVE"
                    : "OFF"}
                </b>

              </div>

            </div>


            {/* =================================================
                RENDERING CALCULATIONS
            ================================================= */}

            <div className="render-heading">

              <span>
                Rendering Calculations
              </span>

              <span className="live">
                ● LIVE
              </span>

            </div>


            <div className="render-grid">


              <div className="render-box">

                <span>
                  Calendar Renders
                </span>

                <strong>
                  {calendarRenderCount.current}
                </strong>

              </div>


              <div className="render-box">

                <span>
                  Post List Renders
                </span>

                <strong>
                  {postListRenderCount.current}
                </strong>

              </div>


              <div className="render-box">

                <span>
                  Event Calculations
                </span>

                <strong>
                  {eventCalculationCount.current}
                </strong>

              </div>


              <div className="render-box">

                <span>
                  User Actions
                </span>

                <strong>
                  {actionCount.current}
                </strong>

              </div>

            </div>


            {/* STATUS */}

            <div className="optimization-status">

              {optimized ? (

                <>
                  <span>●</span>

                  Optimized rendering
                  is enabled
                </>

              ) : (

                <>
                  <span>●</span>

                  Standard rendering
                  is enabled
                </>

              )}

            </div>


            <button
              className="reset-button"
              onClick={
                resetCounters
              }
            >
              Reset Rendering Count
            </button>

          </div>

        </section>

      </main>


      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div className="modal-background">

          <div className="modal">


            <div className="modal-header">

              <div>

                <p className="small-title">
                  CONTENT EDITOR
                </p>

                <h2>
                  {editId
                    ? "Edit Post"
                    : "Create New Post"}
                </h2>

              </div>


              <button

                className="close"

                onClick={() =>
                  setShowModal(false)
                }

              >
                ×
              </button>

            </div>


            <form
              onSubmit={savePost}
            >


              <label>
                Post Title
              </label>

              <input

                type="text"

                placeholder="Enter your post title"

                value={
                  form.title
                }

                onChange={(event) =>
                  setForm({
                    ...form,
                    title:
                      event.target
                        .value
                  })
                }

              />


              <div className="form-row">


                <div>

                  <label>
                    Date
                  </label>

                  <input

                    type="date"

                    value={
                      form.date
                    }

                    onChange={(event) =>
                      setForm({
                        ...form,
                        date:
                          event.target
                            .value
                      })
                    }

                  />

                </div>


                <div>

                  <label>
                    Time
                  </label>

                  <input

                    type="time"

                    value={
                      form.time
                    }

                    onChange={(event) =>
                      setForm({
                        ...form,
                        time:
                          event.target
                            .value
                      })
                    }

                  />

                </div>


              </div>


              <label>
                Platform
              </label>

              <select

                value={
                  form.platform
                }

                onChange={(event) =>
                  setForm({
                    ...form,
                    platform:
                      event.target
                        .value
                  })
                }

              >

                <option>
                  Instagram
                </option>

                <option>
                  Facebook
                </option>

                <option>
                  LinkedIn
                </option>

              </select>


              <div className="modal-buttons">


                <button

                  type="button"

                  className="cancel"

                  onClick={() =>
                    setShowModal(false)
                  }

                >
                  Cancel
                </button>


                <button

                  type="submit"

                  className="save"

                >

                  {editId
                    ? "Update Post"
                    : "Schedule Post"}

                </button>


              </div>


            </form>


          </div>

        </div>

      )}

    </div>

  );
}


export default App;