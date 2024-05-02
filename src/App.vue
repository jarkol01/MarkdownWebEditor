<script setup lang="ts">
</script>

<template>
  <div class="h-svh flex flex-col">
    <!--    <div class="drawer">-->
    <!--      <input id="my-drawer" type="checkbox" class="drawer-toggle" />-->
    <!--      <div class="drawer-content">-->
    <!--        &lt;!&ndash; Page content here &ndash;&gt;-->
    <!--      </div>-->
    <!--      <div class="drawer-side">-->
    <!--        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>-->
    <!--        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">-->
    <!--          &lt;!&ndash; Sidebar content here &ndash;&gt;-->
    <!--          <li><a>Sidebar Item 1</a></li>-->
    <!--          <li><a>Sidebar Item 2</a></li>-->
    <!--        </ul>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="navbar bg-base-100">
      <!--      <div class="flex-none">-->
      <!--        <label for="my-drawer" class="btn btn-square btn-ghost drawer-button">-->
      <!--          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"-->
      <!--               class="inline-block w-5 h-5 stroke-current">-->
      <!--            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>-->
      <!--          </svg>-->
      <!--        </label>-->
      <!--      </div>-->
      <div class="flex-1">
        <a href="#" class="btn btn-ghost text-xl pointer-events-none">Markdown Web Editor</a>
        <span class="opacity-75">
          TODO: Note title here (editable)
        </span>
      </div>
      <div class="flex-none gap-2">
        <ul class="menu menu-horizontal px-1">
          <li>
            <RouterLink to="/">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="/example">Example</RouterLink>
          </li>
          <li>
            <RouterLink to="/editor">Editor</RouterLink>
          </li>
        </ul>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="Profile icon" src="./assets/img/default-profile-icon.svg" />
            </div>
          </div>
          <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
    <!--  <NoteList></NoteList>-->
    <RouterView />
  </div>
</template>
