    	<div class="wrapper">
    			<div class="container">
    				<div class="content">

                        <div class="initLoader"></div>

                        <div class="settings">
                            <div class="logout">
                                <a class="logoutBtn" href="<?php echo $logoutUrl; ?>"></a>
                                <a class="logoutHelper" href="<?php echo $logoutUrl; ?>">logout</a>
                            </div>

                            <div class="counter">
                                <h1>Hi, <br/><?php echo $_SESSION['user_name']; ?>!</h1>
                                <div class="todos_count">
                                    <h1 class="activeItemsNumber">0</h1>
                                    <h3> TO DO</h3>
                                </div>
                                <div class="todos_count_arrow"></div>
                            </div>
                            <div class="arrow_down"></div>
                        </div>

                        <div class="items">
                            <header id="header">
                                <nav>
                                    <ul class="navigation">
                                        <li class="allItems activo">
                                            <div class="listItem">All</div>
                                            <div class="loaderList"></div>
                                        </li>
                                        <li class="activeItems">
                                            <div class="listItem">Active</div>
                                            <div class="loaderList"></div>
                                        </li>
                                        <li class="doneItems">
                                            <div class="listItem">Done</div>
                                            <div class="loaderList"></div>
                                        </li>
                                    </ul>
                                </nav>
                                <div class="new-todo-wrapper">
                                    <input type="text" class="new-todo" placeholder="What needs to be done?">
                                    <div class="loaderNewTodo"></div>
                                </div>
                            </header>

                            <section id="main">
                                <ul class="todo-list"></ul>
                            </section>  
                        </div>    
                    </div>
                </div>
        </div>  

        <script src="public/js/jquery-1.10.2.min.js"></script>
        <script src="public/js/todoapp.js"></script>