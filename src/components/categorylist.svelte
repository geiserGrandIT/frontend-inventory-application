<script>
    export let category;
    export let subcategories;
    let isOpen = false;
  
    function toggle() {
      isOpen = !isOpen;
    }
  </script>
  
  <div class="category">
    <div class="category-header" on:click={toggle}>
      {category}
      {isOpen ? "▼" : "►"}
    </div>
    {isOpen && (
      <ul class="subcategory-list">
        {#each subcategories as subcategory (subcategory)}
          <li>{subcategory}</li>
        {/each}
      </ul>
    )}
  </div>
  
  <style>
    .category {
      margin-bottom: 10px;
    }
  
    .category-header {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  
    .subcategory-list {
      margin-left: 20px;
      list-style-type: none;
    }
  </style>
  